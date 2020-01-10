import React from 'react';
import { View, Text} from 'react-native';
import Touchable from 'react-native-platform-touchable';


export class UndoCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {name, undoDeletionByName} = this.props
        return <View >
            <View style={{ backgroundColor: '#303036', flexDirection: 'row', padding: 12, marginBottom: 1 }}>
                <View style={{ width: '80%' }}>
                    <Text style={{color: '#fff'}}>Deleted {name}. tab to dismiss.</Text>
                </View>
                <Touchable onPress={()=>{undoDeletionByName(name)}}>
                    <Text style={{ fontWeight: 'bold', color: '#e6be0b' }}> Undo </Text>
                </Touchable>
            </View>
        </View>
    }
}