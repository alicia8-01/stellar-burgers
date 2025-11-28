import { FC, memo, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { ModalOverlayUI } from '../../ui';
import { TModalUIProps } from './type';

import styles from './modal.module.css';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title = '', onClose, children }) => {
    const location = useLocation();

    let resolvedTitle = title;
    if (!resolvedTitle && location.pathname.startsWith('/ingredients/')) {
      resolvedTitle = 'Детали ингредиента';
    }

    return (
      <>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h3 className={`${styles.title} text text_type_main-large`}>
              {resolvedTitle}
            </h3>
            <button className={styles.button} type='button'>
              <CloseIcon type='primary' onClick={onClose} />
            </button>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
        <ModalOverlayUI onClick={onClose} />
      </>
    );
  }
);
