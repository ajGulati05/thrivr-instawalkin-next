import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomErrorAlert({ message }) {
  return (
    <AnimatePresence>
      <motion.div
        className="alert-global-success-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        exit={{ opacity: 0 }}
      >
        <Alert variant={'danger'}>{message}</Alert>
      </motion.div>
    </AnimatePresence>
  );
}

CustomErrorAlert.propTypes = {
  message: PropTypes.string,
};
