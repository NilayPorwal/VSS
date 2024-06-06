
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ImageBackground, BackHandler} from 'react-native';


    
    
type Props = {};
export default class SamplingList extends Component<Props> {
	
     static navigationOptions = {
       header: <Image source={require('../Images/Header3.png')} style={{width:'100%', marginTop:(Platform.OS === 'ios')?24:0 }} />,
        headerLeft:null 	   
      };

componentDidMount(){
		 BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	} 	  
	  
  render() {
    return (
	<ImageBackground source={require('../Images/background.png')} style={{width: '100%', height: '100%'}}> 
	<ScrollView>  
      <View style={styles.container}>  
	         
	   <View style={{borderWidth:1, margin:15, alignItems:'center'}}>
	   
	    <View style={{borderWidth:1, padding:15, backgroundColor:'black', width:'100%', marginTop:20}}>
		     
	
		 <View style={{flexDirection:'row', justifyContent:'space-between'}}>
		  <View> 
 		   <Text style={{color:'white', fontFamily:'GoogleSans-Medium', fontSize:18}}>Total Quantity</Text>
		   <Text style={{color:'white', fontFamily:'GoogleSans-Medium', fontSize:18}}>2300</Text>
		  </View>
		  
		  <View>
    	   <Text style={{color:'white', fontFamily:'GoogleSans-Medium', fontSize:18, textAlign:'right'}}>Sampling Quantity</Text>
		   <Text style={{color:'white', fontFamily:'GoogleSans-Medium', fontSize:18, textAlign:'right'}}>23</Text>
		  </View>  
	     </View>
		   
		 <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:15}}>
		  <Text style={{fontFamily:'GoogleSans-Medium', fontSize:18, color:'white'}}>SAMPLING RATIO</Text>
		  <Text style={{fontFamily:'GoogleSans-Medium', fontSize:18, color:'white'}}>10/1000</Text>
		 </View>
	   </View> 
	   
	   
	    <View style={{borderWidth:1, margin:15, padding:15, backgroundColor:'#fe9900', width:'90%'}}>
		 <Text style={{color:'black', fontFamily:'GoogleSans-Medium', marginBottom:15, fontSize:18}}>Material</Text>    
		 
		 <View style={{flexDirection:'row', justifyContent:'space-between'}}>
		  <View>
    	   <Text style={{color:'black', fontFamily:'GoogleSans-Medium',}}>Category</Text>
		   <Text style={{color:'black'}}>Cable</Text>
		  </View>  
		  
		  <View>
    	   <Text style={{color:'black', fontFamily:'GoogleSans-Medium',}}>Unit</Text>
		   <Text style={{color:'black'}}>MM</Text>
		  </View>
		 </View>   
		 
		 <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
		  <View>
    	   <Text style={{color:'black', fontFamily:'GoogleSans-Medium',}}>Sub Category </Text>
		   <Text style={{color:'black'}}>3 sq MM</Text>
		  </View>
		    
		 
		 </View> 
		
		</View>  		                
 		
        <View style={{borderWidth:1, margin:15}}>  
		 <View style={styles.tableHeader}>
		  <Text style={[styles.tableHeaderText, { width:'20%'}]}>S.No.</Text>
		  <Text style={[styles.tableHeaderText, { width:'80%'}]}>Material Serial No.</Text>
		 </View>
		     
		 <View style={styles.tableContent}>
		  <Text style={[styles.tableContentText,{width:'20%'}]}>1</Text>
		  <Text style={[styles.tableContentText,{width:'80%'}]}>1001</Text>
		    
		 </View>  
		   
		 <View style={styles.tableContent}>  
		  <Text style={[styles.tableContentText,{width:'20%'}]}>2</Text>
		  <Text style={[styles.tableContentText,{width:'80%'}]}>1230</Text>
		 </View> 
		 
		 <View style={styles.tableContent}>  
		  <Text style={[styles.tableContentText,{width:'20%'}]}>3</Text>
		  <Text style={[styles.tableContentText,{width:'80%'}]}>1856</Text>
		 </View>   
		</View>    

        <View style={{flexDirection:'row', justifyContent:'space-between', width:'90%'}}>
			<TouchableOpacity style={{borderWidth:1, borderRadius: 5, backgroundColor: '#0099ff', borderColor:'red', marginTop:20}}>
			  <Text style={{fontSize:15, color:'black', fontFamily:'GoogleSans-Medium', paddingTop:10, paddingBottom:10, paddingLeft:25, paddingRight:25}}>Prev</Text>
			</TouchableOpacity>
			
			<TouchableOpacity style={{borderWidth:1, borderRadius: 5, backgroundColor: '#0099ff', borderColor:'red', marginTop:20}}>
			  <Text style={{fontSize:15, color:'black', fontFamily:'GoogleSans-Medium', paddingTop:10, paddingBottom:10, paddingLeft:25, paddingRight:25}}>Next</Text>
			</TouchableOpacity>
		</View>			
		    
	    <TouchableOpacity  style={{borderWidth:1, borderRadius: 5, backgroundColor: 'orange', borderColor:'red', marginTop:20, marginBottom:50}}>
		  <Text onPress={()=>this.props.navigation.goBack()} style={{fontSize:15, color:'black', fontFamily:'GoogleSans-Medium', paddingTop:10, paddingBottom:10, paddingLeft:25, paddingRight:25}}>BACK</Text>
		</TouchableOpacity> 
	 </View>  
	</View>        
   </ScrollView>
   </ImageBackground>
	);                     
  }      
}        

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
	
	},
	
	tableHeader:{
	 flexDirection:'row', backgroundColor:'#33a0ff', borderBottomColor:'lightgrey', borderBottomWidth:1	
	},
	tableHeaderText:{
     padding:10, fontFamily:'GoogleSans-Medium', color:'black', textAlign:'center',  borderRightColor:'lightgrey', borderRightWidth:1, 
	},
	tableContent:{
	 flexDirection:'row', backgroundColor:'#f9cda0', borderBottomColor:'lightgrey', borderBottomWidth:1	
	},
	tableContentText:{
	 padding:10,  color:'black', borderRightColor:'lightgrey', textAlign:'center', borderRightWidth:1,	fontSize:12
	},
	acceptButton:{
     borderWidth:1, borderRadius: 5, backgroundColor: '#669900', borderColor:'red', marginTop:20		
	},
	rejectButton:{
     borderWidth:1, borderRadius: 5, backgroundColor: '#fb0102', borderColor:'red', marginTop:20		
	},
	buttonText:{
     fontSize:15, color:'black', fontFamily:'GoogleSans-Medium', paddingTop:10, paddingBottom:10, paddingLeft:25, paddingRight:25		
	},

});
