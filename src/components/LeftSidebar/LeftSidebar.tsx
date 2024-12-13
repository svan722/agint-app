import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';

type NavItem = {
  name: string;
  to?: string;
  href?: string;
  icon: string;
  disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Towards AGI',
    to: '/agi',
    icon: 'fa6-solid:fire',
  },
  {
    name: 'My Agents',
    to: '/my-bots',
    icon: 'fa6-solid:robot',
    disabled: true,
  },
  {
    name: 'AI Marketplace',
    to: '/ai-marketplace',
    icon: 'fa6-solid:store',
    disabled: true,
  },
  {
    name: 'Build AI Agent',
    to: '/build-agent',
    icon: 'fa6-solid:pen',
    disabled: true,
  },
];

const NavElement = ({ item }: { item: NavItem }) => {
  const commonContent = (
    <>
      <div className="w-[18px] h-[18px] -mt-[2px] mr-2 flex items-center justify-center">
        <Icon icon={item.icon} />
      </div>
      <span className="mr-6">{item.name}</span>
      {item.disabled && (
        <span className="text-xs ml-auto px-2 py-0.5 rounded-xl text-black bg-white">soon</span>
      )}
    </>
  );

  if (item.to) {
    return (
      <NavLink
        key={item.to}
        to={item.disabled ? '#' : item.to}
        className={({ isActive }) =>
          `px-6 py-3 flex items-center cursor-pointer text-xs xl:text-base ${
            item.disabled || !isActive ? 'opacity-40' : ''
          }`
        }
      >
        {commonContent}
      </NavLink>
    );
  }

  return (
    <a
      key={item.href}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`px-6 py-3 flex items-center cursor-pointer ${item.disabled ? 'opacity-40' : ''}`}
    >
      {commonContent}
    </a>
  );
};

export const LeftSidebar = () => {
  return (
    <>
      <div className="flex flex-col h-full">
        {NAV_ITEMS.map((item) => (
          <NavElement key={item.to || item.href} item={item} />
        ))}
        <div className="flex items-center gap-4 ml-6 mb-6 mt-auto">
          <a href="https://x.com/0xAgix" target="_blank">
            <img className="w-10" src="/images/x-icon.png" />
          </a>
          <a href="https://t.me/aigentx_group" target="_blank">
            <img className="w-10" src="/images/tg-icon.png" />
          </a>
        </div>
      </div>
    </>
  );
};
