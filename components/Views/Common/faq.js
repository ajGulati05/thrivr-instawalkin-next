import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Accordion, {
  AccordionToggle,
  AccordionCollapse,
} from 'components/Base/Accordion';
import { FaqStyleWrapper } from './style';

export default function FaqComponent({ title, faqs, className, ...props }) {
  const [faqAccordionActiveKey, setFaqAccordionActiveKey] = useState(null);

  const handleFaqAccordionClick = (key) => {
    setFaqAccordionActiveKey(key === faqAccordionActiveKey ? null : key);
  };
  return (
    <FaqStyleWrapper {...props} className={cx('faq', className)} id="faq">
      <Container>
        <h3 className="title text-center">{title}</h3>
        <Accordion activeKey={faqAccordionActiveKey}>
          {faqs.map((faq) => (
            <Card key={faq.key}>
              <AccordionToggle
                as={Card.Header}
                eventKey={faq.key}
                onClick={() => handleFaqAccordionClick(faq.key)}
              >
                <a
                  className="card-link"
                  aria-expanded={
                    faqAccordionActiveKey === faq.key ? true : false
                  }
                >
                  <span>{faq.title}</span>
                  <img src="/images/down.svg" />
                </a>
              </AccordionToggle>
              <AccordionCollapse eventKey={faq.key}>
                <Card.Body>{faq.description}</Card.Body>
              </AccordionCollapse>
            </Card>
          ))}
        </Accordion>
      </Container>
    </FaqStyleWrapper>
  );
}

FaqComponent.propTypes = {
  faqs: PropTypes.array,
  className: PropTypes.string,
  title: PropTypes.string,
};
