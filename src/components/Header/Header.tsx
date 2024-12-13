import IconLogo from 'src/assets/white-logo.svg?react';
import { ConnectButton } from 'src/components/Header/ConnectButton';
import { ConnectTwitter } from 'src/components/Header/ConnectTwitter';
import { TransactionStatus } from 'src/components/Header/TransactionStatus';

export const Header = () => {
  return (
    <div className="flex items-center px-6 py-4">
      <a href="http://agint.xyz/" target="_blank"><IconLogo /></a>
      <h1 className="text-xl xl:text-2xl ml-8">Artificial General Intelligence</h1>
      <div className="flex items-center space-x-6 ml-auto">
        <TransactionStatus />
        <ConnectTwitter />
        <ConnectButton />
      </div>
    </div>
  );
};
