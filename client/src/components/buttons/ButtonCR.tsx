import * as React from 'react';
import Button, { ButtonProps } from "@material-ui/core/Button";
import { WithStyles, createStyles, Theme, withStyles } from "@material-ui/core";
import { ClassValue } from 'classnames/types';
import { StyleRules } from "@material-ui/core/styles";

declare var CrComLib: typeof import('@crestron/ch5-crcomlib');

// withStyles HOC creates classes prop
const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
    root: {
        margin: theme.spacing(1),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "8rem",
        height: "4rem",
        borderRadius: "0.5rem",
    },
    on: {
        color: "#fff",
        backgroundColor: "#22f",
    },
    off: {
        color: "#aaa",
        backgroundColor: "#118",
    }
  });

// Just my own custom/extended props
interface OwnProps {
    publishSignalName: string,
    subscribeSignalName: string,
    style?: ClassValue;
    styleOn?: ClassValue;
    styleOff?: ClassValue;  
}

type MyState = {
  feedback: boolean;
  subscriptionId: string;
}

// Exposed to user's of component - not styles
type PublicProps = OwnProps & ButtonProps;
type Props = PublicProps & WithStyles<typeof styles>;

// I had to use <any> type since I am getting props from parent and 
// cant specify ALL the properties coming from Material UI Button
class ButtonCR extends React.Component<Props, MyState> {

  constructor(props:Props) {
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
    CrComLib.publishEvent('boolean', this.props.publishSignalName, true);
  }
  
  private onRelease = () => {
    // console.log(`released signal: ${this.props.publishSignalName}`);
    // CrComLib.publishEvent('boolean', this.props.publishSignalName, false);
  }

  public render() {    
    const feedback = this.state.feedback;
    console.log(`feedback: ${feedback}`);
    // decontruct props  - 
    // styles HOC, OwnProps, parent props passed
    const {classes,
      publishSignalName,
      subscribeSignalName,
      style,
      styleOn,
      styleOff,
      ...rest             // gets all the est of the props not specified above (we dont have all the names)
    } = this.props;

    const onStyle = styleOn ? styleOn : classes.on;
    const offStyle = styleOff ? styleOff : classes.off;
    const stateStyle = feedback ? onStyle : offStyle;

    return (
      <Button {...rest} className={`${classes.root} ${style} ${stateStyle}`}
        onClick={this.onPress}
        >
          {this.props.children}
      </Button>
    );
  }
}

export default withStyles(styles)(ButtonCR) as React.ComponentType<PublicProps>;