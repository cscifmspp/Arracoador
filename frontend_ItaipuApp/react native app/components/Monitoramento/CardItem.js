import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Avatar, Card} from 'react-native-paper';

const LeftContent = (props) => <Avatar.Icon {...props} style={{background:"#EADDFF"}} color="#4F378A" icon="check" />;

export default function CardItem(props) {
  return (
    <Card style={styles.card}>
      <Card.Title
        title={props.title}
        subtitle={props.subtitle}
        titleStyle={{fontWeight:600, fontSize: 14 }}
        left={LeftContent}
        right={()=><Image style={{width: 75, height:75,borderTopRightRadius: 10,borderBottomRightRadius: 10}} source={{ uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRUnC6-0okKFQaZilm8UVQZYs_wqhgeymBc7yo1LvRsZcKtg834'}} />}
      />
      
    </Card>
  );
}

const styles = StyleSheet.create({
  card:{
    marginHorizontal: "10px",
    marginVertical: "9px"
  }
})