import React from 'react';
import { NavLink } from "react-router-dom";
import './Routes.css';

export default class Routes extends React.Component {
  render() {
    return (
      <div className="routes">
        <nav>
          <ul>
            <li>
              <NavLink to="/" activeClassName='selected' exact>Game</NavLink>
            </li>
            <li>
              <NavLink to="/setup" activeClassName='selected' exact>Setup</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
