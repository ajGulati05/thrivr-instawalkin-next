import styled from 'styled-components';
import InputGroup from 'react-bootstrap/InputGroup';

const StyledInputGroup = styled(InputGroup)`
  & > .form-control {
    width: 100%;
    flex: 1 1 0%;
  }
`;

export default StyledInputGroup;
