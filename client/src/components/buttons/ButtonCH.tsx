import React, { useState, useEffect } from "react";
import { WithStyles, createStyles, Theme, withStyles } from "@material-ui/core";
import { ClassValue } from 'classnames/types';
import { StyleRules } from "@material-ui/core/styles";
import Button, { ButtonProps } from "@material-ui/core/Button";

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
// Exposed to user's of component - not styles
type PublicProps = OwnProps & ButtonProps;
type Props = PublicProps & WithStyles<typeof styles>;

const ButtonCH: React.FC<Props> = (props) => {
    console.log(`props: ${JSON.stringify(props, null,2)}`);
    
    // decontruct props  - 
    // styles HOC
    const {classes} = props;
    // passed OwnProps
    const {publishSignalName, subscribeSignalName, style, styleOn, styleOff} = props;
    // rest of props past from parent
    const {...rest} = props;

    // State
    const [feedback, setFeedback] = useState(false);

    const onPress = (signalName: string) => {
        console.log(`clicked/pressed, props: ${JSON.stringify(props, null,2)}`);
        CrComLib.publishEvent('boolean', signalName, true);
    }
    
    const onRelease = () => {
        console.log(`released signal: ${publishSignalName}`);
        // CrComLib.publishEvent('boolean', this.props.publishSignalName, false);
    }
    
    useEffect(() => {
        let subscriptionId: string = "";
        if (subscribeSignalName) {
            subscriptionId = CrComLib.subscribeState('boolean', subscribeSignalName, setFeedback);
        }
          
        // When it ends
        return () => {
            CrComLib.unsubscribeState('boolean', subscribeSignalName, subscriptionId);
        }
    }, [subscribeSignalName]);
        
    
    const onStyle = styleOn ? styleOn : classes.on;
    const offStyle = styleOff ? styleOff : classes.off;
    const stateStyle = feedback ? onStyle : offStyle;

    // const className={allstyles.join(" ")}
    // feedback is fro state, all else is from props
    return (
        <Button {...rest} className={`${classes.root} ${style} ${stateStyle}`}
            onClick={() => onPress(publishSignalName)}
            >
            {rest.children}
        </Button>
    );
};

export default withStyles(styles)(ButtonCH) as React.ComponentType<PublicProps>;