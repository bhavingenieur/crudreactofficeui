
import { withOktaAuth } from '@okta/okta-react';
import React, { Component } from 'react';

async function checkUser() {
  if (this.props.authState.isAuthenticated && !this.state.userInfo) {
    const userInfo = await this.props.authService.getUser();
    alert(userInfo);
    this.setState({ userInfo });
  }
}

export default withOktaAuth(class LoginCallback extends Component {
  constructor(props) {
    super(props);
    this.state = { userInfo: null };
    this.checkUser = checkUser.bind(this);
  }

  async componentDidMount() {
    this.checkUser();
  }

  async componentDidUpdate() {
    this.checkUser();
  }

  render() {
    return (
      <div>
        {this.state.userInfo &&
          <div>
            <p>Welcome back, {this.state.userInfo.name}!</p>
          </div>
        }
      </div>
    );
  }
});
