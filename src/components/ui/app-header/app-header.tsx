import React, { FC } from 'react';
import styles from './app-header.module.css';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { TAppHeaderUIProps } from './type';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={clsx(styles.menu, 'p-4')}>
      <div className={styles.menu_part_left}>
        <NavLink to='/' end className={styles.link}>
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p
                className={clsx(
                  'text text_type_main-default ml-2 mr-10',
                  isActive ? 'text_color_primary' : 'text_color_inactive'
                )}
              >
                Конструктор
              </p>
            </>
          )}
        </NavLink>

        <NavLink to='/feed' className={styles.link}>
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p
                className={clsx(
                  'text text_type_main-default ml-2',
                  isActive ? 'text_color_primary' : 'text_color_inactive'
                )}
              >
                Лента заказов
              </p>
            </>
          )}
        </NavLink>
      </div>

      <div className={styles.logo}>
        <Logo className='' />
      </div>

      <NavLink
        to='/profile'
        className={clsx(styles.link, styles.link_position_last)}
      >
        {({ isActive }) => (
          <>
            <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
            <p
              className={clsx(
                'text text_type_main-default ml-2',
                isActive ? 'text_color_primary' : 'text_color_inactive'
              )}
            >
              {userName || 'Личный кабинет'}
            </p>
          </>
        )}
      </NavLink>
    </nav>
  </header>
);
