import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import { motion, AnimatePresence } from 'framer-motion';
import cx from 'classnames';
import PageLoaderStyleWrapper from './pageLoader.style';

export default function PageLoaderComponent({
  children,
  visible,
  className,
  ...props
}) {
  return (
    <PageLoaderStyleWrapper {...props} className={cx(className)}>
      <AnimatePresence>
        {visible && (
          <motion.div
            key={'page-loader-key'}
            className={cx('page-loader-wrap')}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="page-loader-overlay"></motion.div>
            <Loader
              className="page-loader-component"
              type="ThreeDots"
              color="#ff7271"
              height={100}
              width={100}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </PageLoaderStyleWrapper>
  );
}

PageLoaderComponent.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool,
  className: PropTypes.string,
};
