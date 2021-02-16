import React from 'react'
import {
    useLocation
  } from "react-router-dom";

function NoMatch() {
   let location = useLocation();

  return (
    <div>
      <h3>
        404 page not found
      </h3>
      <img src="https://i.pinimg.com/originals/ef/8b/bd/ef8bbd4554dedcc2fd1fd15ab0ebd7a1.gif" alt=""/>

    </div>
  );
}

export default NoMatch
