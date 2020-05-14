import * as React from 'react';
import Button from '@material-ui/core/Button';
import { pushDigital, useSubscribeDigital } from "../react-ch5/react-ch5";
import { withStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';

interface IProps {
  classes: any;
}
interface IButtonCRProps {
  publishSignalName: string,
  subscribeSignalName: string
}

interface IState {
  feedback: boolean;
}

const styles = (theme: Theme) => ({
  root: {
      [theme.breakpoints.up('md')]: {
          marginLeft: "57px",
      },
      paddingTop: "10px"
  },
  buttonOn: {
    color: "#fff",
    backgroundColor: "#22f"
  },
  buttonOff: {
    color: "#fff",
    backgroundColor: "#118"
  }
});

class ButtonCR extends React.Component<IProps, IButtonCRProps, IState> {

  constructor(props) {
    super(props);

    this.state = {
      feedback: false
    }
  }

  componentDidMount() {
    const feedback = useSubscribeDigital(this.props.subscribeSignalName);
    this.setState({feedback: feedback});
  }

  componentDidUpdate(prevProps) {

  }

  private onPress() {
    pushDigital(this.props.publishSignalName, true);
  }

  private onRelease = () => {
    pushDigital(this.props.publishSignalName, false);
  }

  public render() {
    const { classes } = this.props;
    
    const feedback = this.state.feedback;
    console.log(`feedback: ${feedback}`);

    const className = classnames(feedback ? classes.buttonOn : classes.buttonOff );

    return (
      <Button
        className={className}
        onClick={this.onPress}
        onMouseDown={this.onPress}
        onMouseUp={this.onRelease}
        onTouchStart={this.onPress}
        onTouchEnd={this.onRelease}
        onTouchCancel={this.onRelease}>
          <div style={{ margin: 'auto' }}>
            {this.props.children}
          </div>
      </Button>
    );
  }
}

export default withStyles(styles)(ButtonCR);