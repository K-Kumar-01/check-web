import React, { Component, PropTypes } from 'react';
class UserProfileFollowersCounter extends Component {

  render () {
    return(
    <div> <button type="button">Followers: {this.props.followersCount}</button> </div>
    )
  }
})
export default UserProfileFollowersCounter;
