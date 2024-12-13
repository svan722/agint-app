// Uniswap V2 router address и ABI (для свопов)
import { BrowserProvider, ethers } from 'ethers';
import { UncheckedJsonRpcSigner } from '../../../utils/UncheckedJsonRpcSigner';
import { useSetModal } from '../../../providers/ModalsProvider';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { UniswapV2RouterAbi } from 'src/abi';
import { useTransactions } from '../../../providers/TransactionsProvider';
import debug from 'debug';

const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const UNISWAP_ROUTER_ABI = UniswapV2RouterAbi;

const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const ETH_AMOUNT = 0.001; // Количество ETH для свопа на каждый токен
const DEADLINE = Math.floor(Date.now() / 1000) + 600; // 10 минут с текущего момента

const log = debug('agi/hooks:useSwapTx');

export const useSwapTx = () => {
  const setModal = useSetModal();
  const { address } = useWeb3ModalAccount();
  const { trackTx, trackError } = useTransactions();
  const { walletProvider } = useWeb3ModalProvider();

  async function handleSignTx(tokenAddress: string, name: string) {
    if (!walletProvider || !address) return;
    let tx: ethers.TransactionResponse | undefined;

    try {
      // const provider = new BrowserProvider(walletProvider);
      // const signer = await provider.getSigner();
      const mockTx = {
        to: '0xRecipientAddress', // адрес получателя
        value: ethers.parseEther('0.01'), // сумма в эфире
        gasLimit: 21000, // лимит газа для простой транзакции
        gasPrice: ethers.parseUnits('10', 'gwei'), // цена газа
      };

      const signer = new UncheckedJsonRpcSigner(new BrowserProvider(walletProvider), address);
      const uniswapContract = new ethers.Contract(
        UNISWAP_ROUTER_ADDRESS,
        UNISWAP_ROUTER_ABI,
        signer,
      );
      const amountOutMin = 0;

      tx = await uniswapContract.swapExactETHForTokensSupportingFeeOnTransferTokens(
        amountOutMin, // Минимальное количество токенов на выходе
        [WETH_ADDRESS, tokenAddress], // Путь (ETH -> Token)
        address, // Адрес получателя
        DEADLINE, // Дедлайн (timestamp)
        {
          value: ethers.parseEther(ETH_AMOUNT.toString()), // Количество ETH для отправки
          gasLimit: 200000, // Ожидаемый лимит газа
          gasPrice: ethers.parseUnits('20', 'gwei'), // Цена газа
        },
      );
      setModal({ modalKey: 'loader', title: 'Confirm your transaction in the wallet' });

      tx = await signer.sendTransaction(mockTx);

      setModal({
        modalKey: 'loader',
        title: 'Processing swap',
        txHash: tx.hash,
      });

      trackTx(tx);

      log('tx', tx);
      await tx.wait();
      setModal(null);

      log('tx success');
    } catch (e) {
      trackError(e, tx);
      setModal(null);
      console.error('tx failed:', e);
      throw e;
    }
  }

  return handleSignTx;
};
