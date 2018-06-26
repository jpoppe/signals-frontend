/**
*
* ListComponent
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import './style.scss';

class ListComponent extends React.Component { // eslint-disable-line react/prefer-stateless-function
  selectIncident = (incident) => () => {
    this.props.incidentSelected(incident);
  }

  render() {
    return (
      <div className="list-component col-8">
        Er zijn {this.props.incidents.length} meldingen gevonden.
        <table className="" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th className="">Id</th>
              <th className="">Datum</th>
              <th className="">Tijd</th>
              <th className="">Stadsdeel</th>
              <th className="">Rubriek</th>
              <th className="">Afdeling</th>
              <th className="">Status</th>
              <th className="">Adres</th>
            </tr>
          </thead>
          <tbody>
            {this.props.incidents.map((incident) => (
              <tr key={incident.id} onClick={this.selectIncident(incident)}>
                <td>{incident.id}</td>
                <td>{incident.incident_date}</td>
                <td>{incident.user}</td>
                <td>{incident.location.stadsdeel}</td>
                <td>{incident.subcategory}</td>
                <td>{incident.department}</td>
                <td>{incident.current_state.state}</td>
                <td>{incident.user}</td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

ListComponent.propTypes = {
  incidents: PropTypes.array.isRequired,
  incidentSelected: PropTypes.func.isRequired,
};

// export default withRouter(ListComponent);
export default withRouter(ListComponent);