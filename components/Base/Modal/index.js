import React, { useState } from 'react';
import cx from 'classnames';
import Modal from 'react-bootstrap/Modal';

export default function CustomModal({
  className,
  visible,
  onHide,
  size,
  container,
  ...props
}) {
  return (
    <Modal
      size={size}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={visible}
      className={className}
      onHide={onHide}
      container={container}
      {...props}
    >
      <Modal.Header closeButton closeLabel="Close">
        {props.header}
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>{props.footer}</Modal.Footer>
    </Modal>
  );
}
