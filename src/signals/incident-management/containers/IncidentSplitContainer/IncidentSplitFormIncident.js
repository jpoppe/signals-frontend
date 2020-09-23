import React, { useCallback, useState, Fragment } from 'react';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import { typesList, priorityList } from 'signals/incident-management/definitions';

import TextArea from 'components/TextArea';

import SelectInput from 'components/SelectInput';
import RadioInput from './RadioInput';

import { StyledBorderBottomWrapper, StyledButton, StyledHeading } from './styled';

const INCIDENT_SPLIT_LIMIT = 10;

const IncidentSplitFormIncident = ({ parentIncident, subcategories, register, control, splitLimit }) => {
  const [indexes, setIndexes] = useState([1]);

  const addIncident = useCallback(
    event => {
      event.preventDefault();

      if (indexes.length > splitLimit - 1) return;

      setIndexes(previousIndexes => [...previousIndexes, indexes.length + 1]);
    },
    [indexes, splitLimit]
  );

  return (
    <Fragment>
      {indexes.map(index => (
        <fieldset key={`incident-splitform-incident-${index}`}>
          <StyledBorderBottomWrapper>
            <StyledHeading forwardedAs="h3" data-testid="splittedIncidentTitle">
              Deelmelding {index}
            </StyledHeading>

            <TextArea
              name={`issues[${index}].description`}
              ref={register}
              rows={10}
              defaultValue={parentIncident.description}
            />

            {/*
          <Controller
            as={<SelectInput options={subcategories} name={`issues[${index}].subcategory`} />}
            label={<strong>Subcategorie</strong>}
            display="Subcategorie"
            control={control}
            name={`issues-${index}-subcategory`}
            defaultValue={parentIncident.subcategory}
            sort
          />
          */}

            <RadioInput
              display="Urgentie"
              register={register}
              initialValue={parentIncident.priority}
              name={`issues[${index}].priority`}
              id="priority"
              options={priorityList}
            />

            <RadioInput
              display="Type"
              register={register}
              initialValue={parentIncident.type}
              name={`issues[${index}].type`}
              id="type"
              options={typesList}
            />
          </StyledBorderBottomWrapper>
        </fieldset>
      ))}

      {indexes.length < splitLimit && (
        <StyledBorderBottomWrapper>
          <StyledButton
            type="button"
            variant="primaryInverted"
            onClick={addIncident}
            data-testid="incidentSplitFormSplitButton"
          >
            Extra deelmelding toevoegen
          </StyledButton>
        </StyledBorderBottomWrapper>
      )}
    </Fragment>
  );
};

IncidentSplitFormIncident.defaultProps = { splitLimit: INCIDENT_SPLIT_LIMIT };

IncidentSplitFormIncident.propTypes = {
  parentIncident: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    statusDisplayName: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    subcategory: PropTypes.string.isRequired,
    subcategoryDisplayName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  subcategories: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      info: PropTypes.string,
    })
  ).isRequired,
  register: PropTypes.func,
  splitLimit: PropTypes.oneOf([...new Array(INCIDENT_SPLIT_LIMIT)].map((_, index) => index + 1)),
  // control: PropTypes.shape({ setValue: PropTypes.func }).isRequired,
};

export default IncidentSplitFormIncident;
