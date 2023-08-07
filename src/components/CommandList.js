import React from 'react'

const CommandList = () => {
  return (
    <div>
      <h1>Commands:</h1>
      <div class="commands">
      <ul class="column-short">
        <li className="column-heading">
            Command
        </li>
        <li class="column-item">
          /ping
        </li>
        <li class="column-item">
          /server
        </li>
        <li class="column-item">
          /reactionrole
        </li>
      </ul>
      <ul class="column-long">
        <li className="column-heading">
            Description
        </li>
        <li class="column-item">
          Pong!
        </li>
        <li class="column-item">
          View server details
        </li>
        <li class="column-item">
          Set server roles with message reactions (WIP)
        </li>
      </ul>

      </div>
    </div>
  )
}

export default CommandList