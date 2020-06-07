import React, { useState, useEffect } from "react";
import { WithStyles, createStyles, Theme, withStyles } from "@material-ui/core";
import { ClassValue } from 'classnames/types';
import { StyleRules } from "@material-ui/core/styles";
import TextField, { TextFieldProps} from "@material-ui/core/TextField";

declare var CrComLib: typeof import('@crestron/ch5-crcomlib');

// withStyles HOC creates classes prop
const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
    container: {
        display: "flex",
        flexWrap: "wrap",
        backgroundColor: "white"
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
        backgroundColor: "white"
    },
    formControl: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
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
type PublicProps = OwnProps & TextFieldProps;
type Props = PublicProps & WithStyles<typeof styles>;

const TextFieldCH: React.FC<Props> = (props) => {    
    // decontruct props  - 
    // styles HOC, OwnProps, parent props passed
    const {classes,
        publishSignalName,
        subscribeSignalName,
        style,
        ...rest             // gets all the est of the props not specified above (we dont have all the names)
    } = props;

    // State
    const [value, setValue] = useState("");

    const handleChange = (event: any)=> {
        
        const name = event.target.name;
        const value = event.target.value;
        console.log(`value: ${value}`);
        CrComLib.publishEvent('string', publishSignalName, value);
        // setValue(value);
    };

    
    // const onRelease = () => {
    //     console.log(`released signal: ${publishSignalName}`);
    //     // CrComLib.publishEvent('string', this.props.publishSignalName, false);
    // }
    
    useEffect(() => {
        let subscriptionId: string = "";
        if (subscribeSignalName) {
            subscriptionId = CrComLib.subscribeState('string', subscribeSignalName, setValue);
        }
        // When it ends
        return () => {
            CrComLib.unsubscribeState('string', subscribeSignalName, subscriptionId);
        }
    }, [subscribeSignalName]);
        
    
    const myStyle = style ? style : classes;

    // const className={allstyles.join(" ")}
    // value is fro state, all else is from props
    return (
        <TextField {...rest} className={`${classes.textField} ${style} ${myStyle}`}
            value={value}
            onChange={handleChange}
        >
            {rest.children}
        </TextField>

    );
};

export default withStyles(styles)(TextFieldCH) as React.ComponentType<PublicProps>;