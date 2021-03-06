import React from 'react';
import {connect} from "react-redux";
import { Translate } from 'react-redux-i18n';

const Tooltip = ({x, y, label, toggled}) => (
  <div className={`tooltip ${toggled ? ' ' : 'hidden'}`}
    style={
      {
        top:y,
        left:x
      }
    }
  >
    <Translate value={label}/>
  </div>
)

/*
* to make tooltip work we need the following key value pairs in order to map it's state to props
* x for x mouse position
* y for y mouse position
* label for text that will be shown into the tooltip
* toogled (bool) to detect if the menu is folded or not - toggled false - menu is folded
*/
const mapStateToProps = ({tooltip}) => (
  {
    x:tooltip.x,
    y:tooltip.y,
    label:tooltip.label,
    toggled:tooltip.toggled
  }
)

export default connect(mapStateToProps, null)(Tooltip)
