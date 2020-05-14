import * as React from 'react';
import Button from '@material-ui/core/Button';
import classnames from 'classnames';
import styles from './ButtonCR.module.scss';
declare var CrComLib: typeof import('@crestron/ch5-crcomlib');

interface IButtonCRProps {
  publishSignalName: string,
  subscribeSignalName: string
}

interface IState {
  feedback: boolean;
  subscriptionId: string;
}

class ButtonCR extends React.Component<any, IState> {

  constructor(props:any) {
    super(props);

    this.state = {
      feedback: false,
      subscriptionId: ""
    }

    this.receiveFeedback = this.receiveFeedback.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.onPress = this.onPress.bind(this)
    this.onRelease = this.onRelease.bind(this)
  }

  receiveFeedback(feedback: boolean) {
    console.log(`received feedback: ${feedback}`);
    this.setState({feedback: feedback});
  }

  componentDidMount() {
    const subscriptionId = CrComLib.subscribeState('boolean', this.props.subscribeSignalName, this.receiveFeedback);
    this.setState({subscriptionId: subscriptionId});
  }

  componentDidUpdate(prevProps:any) {
    if (this.props.subscribeSignalName !== prevProps.subscribeSignalName) {
      if (this.state.subscriptionId && this.state.subscriptionId !== "") {
        CrComLib.unsubscribeState('boolean', prevProps.subscribeSignalName, this.state.subscriptionId);
      }
      const subscriptionId = CrComLib.subscribeState('boolean', this.props.subscribeSignalName, this.receiveFeedback);
      this.setState({subscriptionId: subscriptionId});
    }
  }

  componentDidUnMount() {
    if (this.props.subscribeSignalName) {
      if (this.state.subscriptionId && this.state.subscriptionId !== "") {
        CrComLib.unsubscribeState('boolean', this.props.subscribeSignalName, this.state.subscriptionId);
      }
    }
  }

  private onPress() {
    console.log(`clicked/pressed, props: ${JSON.stringify(this.props, null,2)}`);
    CrComLib.publishEvent('boolean', this.props.publishSignalName, true);
  }
  
  private onRelease = () => {
    // console.log(`released signal: ${this.props.publishSignalName}`);
    // CrComLib.publishEvent('boolean', this.props.publishSignalName, false);
  }

  public render() {    
    const feedback = this.state.feedback;
    console.log(`feedback: ${feedback}`);

    // This is a total hack since I do not know how to pass stype props from parent properly - need mor react help
    const allClasses = this.props;
    let parentClasses: any = {};
    Object.keys(allClasses).forEach((key: Extract<keyof typeof allClasses, string>) => {
      if (key !=="children" && key !=="publishSignalName" && key !=="subscribeSignalName") {
        const value:string = allClasses[key];
        parentClasses[key] = value;
      }
    })
    
    const className = classnames(styles.default, feedback ? styles.bottonOn : styles.buttonOff );

    return (
      <Button {...parentClasses} color={feedback ? "primary" : "secondary"}
        className={className}
        onClick={this.onPress}
        >
          {this.props.children}
      </Button>
    );
  }
}

export default ButtonCR;