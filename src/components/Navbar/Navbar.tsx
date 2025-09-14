import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import logo from '../../assets/weather.png';
import { CloudyIcon, List } from 'lucide-react';
import { SVGProps } from 'react';

interface NavItem {
  label: string;
  to: string;
  Icon: React.ComponentType<SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  { label: 'Cities', to: '/', Icon: List },
  { label: 'Weather', to: '/weather', Icon: CloudyIcon },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 w-full md:static md:w-[100px] bg-gray flex md:flex-col p-5 md:rounded-2xl gap-5 md:gap-0 justify-around md:justify-start z-10">
      <div className="mb-12 hidden md:block">
        <img src={logo} alt="logo" className="w-12 h-12 mx-auto" />
      </div>

      {navItems.map(({ label, to, Icon }) => {
        const isActive = location.pathname === to;

        return (
          <Link
            key={to}
            to={to}
            className={clsx(
              'flex flex-col items-center justify-center mb-8 gap-2 transition-colors duration-300',
              isActive ? 'text-active' : 'text-subtle'
            )}
          >
            <Icon
              className={clsx(
                'w-6 h-6 transition-transform duration-300',
                isActive ? 'scale-110' : 'scale-100'
              )}
            />
            <p className="text-base">{label}</p>
          </Link>
        );
      })}
    </div>
  );
}
