import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import ClipLoader from 'react-spinners/ClipLoader';
import { useImage } from 'react-image';
import { CustomImageComponentStyle } from '../../StyleComponent';

function ImageSource({ src }) {
  const { src: srcList } = useImage({
    srcList: [src, '/images/avatar.png'],
  });

  return <img src={srcList} />;
}

ImageSource.propTypes = {
  src: PropTypes.string,
};

export default function CustomImageComponent({ src, ...props }) {
  return (
    <Suspense
      fallback={<ClipLoader size={30} color={'#ff7271'} loading={true} />}
    >
      <CustomImageComponentStyle {...props}>
        <ImageSource src={src} />
      </CustomImageComponentStyle>
    </Suspense>
  );
}

CustomImageComponent.propTypes = {
  src: PropTypes.string,
};
