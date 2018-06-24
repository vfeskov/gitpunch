import React, { PureComponent } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom'

export class Privacy extends PureComponent {
  render () {
    const { className, classes } = this.props
    return (
      <div className={`${className} ${classes.container}`}>
        <Link to="/">Back to Home</Link>
        <h1>Privacy Policy</h1>
        <p>We only collect and process the bare minimum of your personal information to fulfill purpose of this service. Besides <a href="https://aws.amazon.com/" target="_blank" rel="noopener noreferrer">AWS</a> and <a href="https://www.mongodb.com" target="_blank" rel="noopener noreferrer">MongoDB</a> that provide infrastructure to make it all work, no other third party has access to your data.</p>
        <p>Here are the details:</p>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Source</th>
              <th>Reason</th>
              <th>Handling</th>
              <th>Disposal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Email address</td>
              <td className={classes.nowrap}>
                <ol>
                  <li>Sign Up form</li>
                  <li>GitHub</li>
                </ol>
              </td>
              <td>Update you with news from GitHub.com and occasionally GitPunch.com</td>
              <td rowSpan="2">
                <ul>
                  <li><a href="https://aws.amazon.com/" target="_blank" rel="noopener noreferrer">AWS</a> to run server and scripts</li>
                  <li><a href="https://www.mongodb.com/cloud/atlas" target="_blank" rel="noopener noreferrer">MongoDB Atlas</a> is the database</li>
                </ul>
              </td>
              <td rowSpan="2">
                Upon request
              </td>
            </tr>
            <tr>
              <td>GitHub access token</td>
              <td>GitHub</td>
              <td>
                <ol>
                  <li>Get your email address and stars repositories</li>
                  <li>Search GitHub repos</li>
                </ol>
              </td>
            </tr>
            <tr>
              <td>IP Address</td>
              <td rowSpan="2" className={classes.nowrap}>Visiting website</td>
              <td>System health monitoring</td>
              <td>Access logs at <a href="https://aws.amazon.com/" target="_blank" rel="noopener noreferrer">AWS</a></td>
              <td className={classes.nowrap}>
                <ol>
                  <li>Upon request</li>
                  <li>After 7 days</li>
                </ol>
              </td>
            </tr>
            <tr>
              <td>Cookies</td>
              <td>
                <ol>
                  <li><code>token</code> to keep you signed in</li>
                  <li><code>dontShowIntro</code> to not show intro</li>
                </ol>
              </td>
              <td></td>
              <td className={classes.nowrap}>
                <ul>
                  <li>Sign out</li>
                  <li>Delete cookies</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        <p>To request changes regarding your personal information click Contact link at the bottom of the page.</p>
        <p>If you're under the age of 13, you may not have an account on GitPunch.</p>
        <p>We will use your email address to communicate to you:</p>
        <ol>
          <li>New releases on GitHub</li>
          <li>Important updates regarding GitPunch, like changes to this Privacy Policy</li>
        </ol>
        <Link to="/">Back to Home</Link>
      </div>
    )
  }
}

export default withStyles(theme => ({
  container: {
    '@global': {
      table: {
        borderCollapse: 'collapse',
        '@global': {
          'ol, ul': {
            margin: 0,
            paddingLeft: '18px'
          }
        }
      },
      'table, td, th': {
        border: '1px solid black'
      },
      'td, th': {
        padding: '10px'
      },
      '*': {
        lineHeight: 1.5
      },
      'code': {
        padding: '0 5px 2px',
        border: '1px solid #ddd',
        borderRadius: '3px',
        backgroundClip: 'padding-box'
      }
    }
  },
  nowrap: {
    whiteSpace: 'nowrap'
  }
}))(Privacy)
