import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableOpacity,Alert,
        BackHandler, Modal, TouchableWithoutFeedback,ImageBackground,TextInput, 
		ActivityIndicator, AsyncStorage, ScrollView, FlatList, ToastAndroid} from 'react-native';
import APIManager from '../Managers/APIManager';
import { Base64 } from 'js-base64';
import Loader from 'react-native-modal-loader';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';

var dateFormat = require('dateformat');
          
global.InspectorConfirmationScreen;    
type Props = {};  
export default class InspectorConfirmationScreen extends Component<Props> {
	  
	   constructor(props) {  
       super(props);     
		  this.state = {  
		  details:[], 		   
          woDetails:[],
          vendId:'',
          isRefreshing:true,
          error:false,
          offerQty:'',    
          modalVisible:false,
          siteofferQty:null,
          inspectionCnfrmAiId:null,    
          item:{},
          packStartSrno:null,
          packEndSrno:null,
          image:[],
		  imageData:[],
		  qtystatus:null,
		  pdiofferAiId:null,
		  showSrNo:false
		   }    
		  global.InspectorConfirmationScreen = this;
	   }     
	
	 
	
   static navigationOptions = {
       header: <Image source={require('../../Images/Header3.png')} style={{width:'100%', marginTop:(Platform.OS === 'ios')?24:0 }} />,
       headerLeft:null  	   
    };	  
	

  componentDidMount(){
	
	 this.getInspId();  
	 
	  BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack);
	}  
	  
  async getInspId(){  
		 await AsyncStorage.getItem('InspId').then((value) => 
			this.setState({vendId:value},()=>{this.getInspectorConfirmationDetails()} )	
		 )         
	 } 
 
      
  getInspectorConfirmationDetails(){

      APIManager.getInspectorConfirmationDetails(this.state.vendId, 
        (responseJson)=> { 
	     //alert(JSON.stringify(responseJson));  
	        if (responseJson.status == 'SUCCESS'){ 
	         this.setState({details:responseJson.data, isRefreshing:false})
	        } 
	        else{
	         this.setState({error:true, isRefreshing:false})	
	        }
	      }, (error)=>{
	      	 this.setState({isRefreshing:false})	
	      	 console.log(JSON.stringify(error));  
	      })                   
   }   
	     
     
 
  addOfferQty(){
  	if(this.state.showSrNo == true){

  	if(this.state.packStartSrno == null || this.state.packStartSrno.toString().trim() == "") {
     return Alert.alert("Wait !!", "Start Serial No. is required")
  	}
  	if(this.state.packEndSrno == null || this.state.packEndSrno.toString().trim() == "") {
     return Alert.alert("Wait !!", "End Serial No. is required")
  	}
  	if(this.state.siteofferQty == null || this.state.siteofferQty.toString().trim() == "") {
     return Alert.alert("Wait !!", "Site offer quantity is required")
  	}
    if(this.state.siteofferQty > this.state.item.balanceQty){
       return Alert.alert("Wait !!", "Site Offer Quantity can not be greater than remaining Quantity")
  	}
    if(this.state.image.length == 0){
       return Alert.alert("Wait !!", "Image of Packing list is required")
  	}

     let x = (this.state.item.offerQty * 1.05)
    if(this.state.siteofferQty.trim() > x && this.state.item.woSpoAiId == 1){
      return Alert.alert("Site Offer Quantity can not be greater than 5% of Scheduled Quantity")
    }
   }

    this.setState({isRefreshing:true})
       const  Details = {
            "inspectionCnfrmAiId":this.state.item.inspectionCnfrmAiId,
			"nominationAiId" :this.state.item.nominationAiId,
			"pdiOfferAiId" :this.state.item.pdiOfferAiId,
			"vendorConfirmStatus" : 1,
			"vendorConfirmRemarks" : "thanks"
         }
        // alert( JSON.stringify(Details))
        APIManager.onConfirmByVendor(Details,
        (responseJson)=> {
	         console.log(JSON.stringify(responseJson));    
	        if (responseJson.status == 'SUCCESS'){
	          if(this.state.showSrNo == true){
	        	this.onSubmitOffer()
	          }
	          else
	          {
	          	this.onConfirm()

	          }	
	        } 
	        else{
	        	this.setState({isRefreshing:false, modalVisible:false})
                ToastAndroid.show('Please Try Again !', ToastAndroid.CENTER);
	        }
	       //this.setState({offerDetails:responseJson.data})
	      }, (error)=>{
	      	 console.log(JSON.stringify(error)); 
	           // Alert.alert("Confirmation Failure !!", JSON.stringify(error))
	           this.setState({isRefreshing:false})
		  })

	 } 	 
  
      
  onCnfm(item){ 
	  //alert(item.pdiOfferAiId)
	  this.setState({ siteofferQty: item.offerQty.toString(), qtystatus: item.qtyStatus, pdiofferAiId: item.pdiOfferAiId,  item:item}, ()=>{ this.setState({modalVisible:true})})
   }    

   onSubmitOffer(){
      this.setState({isRefreshing:true})
       const  Details = {
            deliverySchAiId:'',
			offerQty:'',
			offerSupplyDat:'',
			pdiOfferAiId:this.state.item.pdiOfferAiId,
			packStartSrno:this.state.packStartSrno,
			packEndSrno:this.state.packEndSrno,
			dateOfReadiness:"",
			withPackingList:'Y'
         }
        // alert(JSON.stringify(Details)) 
        APIManager.onSubmitOffer(Details,"PDI",
        (responseJson)=> {
	        console.log(JSON.stringify(responseJson));  
	        if (responseJson.status == 'SUCCESS'){
             this.onConfirm()
	        }
	        else{
              ToastAndroid.show('Please Try Again !', ToastAndroid.CENTER);
               this.setState({isRefreshing:false})
	        }
	       //this.setState({offerDetails:responseJson.data})
	    }, (error)=>{
	    	 console.log(JSON.stringify(error)); 
          // Alert.alert("Confirmation Failure !!", JSON.stringify(error))
             this.setState({isRefreshing:false})
	    })                
         
   }

    getSerialNoDetials(item){
      this.setState({isRefreshing:true, showSrNo:false})
  
        // alert(JSON.stringify(Details))
        APIManager.getSerialNoDetials(item.pdiOfferAiId,
        (responseJson)=> {
	        //alert(JSON.stringify(responseJson));  
	        if (responseJson.status == 'SUCCESS'){
             if(responseJson.data.pdiOfferSrNo == null || responseJson.data.pdiOfferSrNo == "0"){
               this.setState({showSrNo:true})
             }
              this.setState({ isRefreshing:false, siteofferQty: item.offerQty.toString(), qtystatus: item.qtyStatus, pdiofferAiId: item.pdiOfferAiId,  item:item}, ()=>{ this.setState({modalVisible:true})})

	        }
	        else{
              ToastAndroid.show('Please Try Again !', ToastAndroid.CENTER);
               this.setState({isRefreshing:false})
	        }
	       //this.setState({offerDetails:responseJson.data})
	    }, (error)=>{
	    	 console.log(JSON.stringify(error)); 
          // Alert.alert("Confirmation Failure !!", JSON.stringify(error))
             this.setState({isRefreshing:false})
	    })                
         
   }
  
  onConfirm(){
  	 
    const  Details = {
    	   "inspectionCnfrmAiId":this.state.item.inspectionCnfrmAiId,
           "inspectionSiteOfferQty":this.state.siteofferQty,
			"totalPackageNo" :'',
			"qtyPerPackage" :'',
			"pckgStrtSerialNo" : '',
			"mtrlStrtSerialNo" : "",
			"pckingListDocPath":"",
			"packingExtn":'',       
			"siteDocPath":'',
			"siteDocExtn":'',
			"inspectionCnfrmOfferPhoto":this.state.imageData
         }
         console.log(JSON.stringify(Details))
        APIManager.addOfferQty(Details, 
        (responseJson)=> {
	        console.log(JSON.stringify(responseJson));
	        if (responseJson.status == 'SUCCESS'){
			  //this.props.navigation.navigate('HomeScreen')
				console.log(JSON.stringify("responseJson: ",responseJson));

			  if(this.state.qtystatus=="Y"){
				  this.getInspectorConfirmationDetails()
				  this.closeModal()
				  ToastAndroid.show('Successfuly Updated', ToastAndroid.CENTER);
			  }
			  else{
				  APIManager.workorderMatQtyAdd(this.state.pdiofferAiId, this.state.siteofferQty,
				  (responseJson) => {
					  console.log(JSON.stringify(responseJson));
					  if (responseJson.status == 'SUCCESS') {
						  this.getInspectorConfirmationDetails()
						  this.closeModal()
						  ToastAndroid.show('Successfuly Updated', ToastAndroid.CENTER);
					  }
					 
					  //this.setState({offerDetails:responseJson.data})
				  }, (error) => {
					  console.log(JSON.stringify(error));
					  // Alert.alert("Confirmation Failure !!", JSON.stringify(error))
					  this.setState({ isRefreshing: false })
				  })    
			  }

	        } 
	        else{
	           this.setState({isRefreshing:false})	
               ToastAndroid.show('Please Try Again !', ToastAndroid.CENTER);
	        }
	       //this.setState({offerDetails:responseJson.data})
	      },(error)=>{
	      	 console.log(JSON.stringify(error)); 
            // Alert.alert("Confirmation Failure !!", JSON.stringify(error))
             this.setState({isRefreshing:false})
	    }) 

  } 

  	onCamera(){
  	if(this.state.image.length >= 5){
       return Alert.alert("Maximum number of document exceeded")
  	}   
	      
     var options = {
		  title: 'Select Avatar',
		  quality: 0.2,
		  storageOptions: {
		    path: 'images'
		  }  
		};
		ImagePicker.showImagePicker(options, (response) => {
		  console.log('Response = ', response);

		  if (response.didCancel) {
		    console.log('User cancelled image picker');
		  }
		  else if (response.error) {
		    console.log('ImagePicker Error: ', response.error);
		  }
		 
		  else {
			//  let type = response.type.slice(6, 10)
		   // You can also display the image using data:
		   // console.log('data:image/jpeg;base64,'response.data);
		   let source = {
		   	"inspectionCnfrmAiId":this.state.item.inspectionCnfrmAiId,
		    "uploadPackingListPhotoPath":'data:image/jpeg;base64,' + response.data,
		    "extn" :"png"
		   } 
           
		  this.setState({  
			  image: [...this.state.image,{image:response.uri}],    
			  imageData:[...this.state.imageData, source],
			  photoExtension:"png"
			});     
		  }
		});    	  
		         
	}  
	
	closeModal(){
		 this.setState({modalVisible:false, imageData:[], image:[], packStartSrno:null, packEndSrno:null, isRefreshing:false, item:{}, siteofferQty:null})
	}   	 
	   	    
	    
  render() {    
	
    return (
	  <ImageBackground source={require('../../Images/background.png')} style={{width: '100%', height: '100%'}}> 
      <ScrollView>
	  <View style={styles.container}>
	    <Loader loading={this.state.isRefreshing} color="#40a7ab" />
       

      <View style={{width:'20%'}} style={{flexDirection:'row'}}>
      <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
	   <Icon name="chevron-left" size={20} color="#000000" style={{margin:15}}   />
      </TouchableOpacity>
      <View style={{width:'80%'}}> 
       <Text style={{fontSize:18, fontFamily:'GoogleSans-Medium', color:'black', paddingTop:15, textAlign:'center' }}>Confirmation By Inspector</Text>
      </View>  
     </View> 
        
       
      {(this.state.details.length > 0)?
        <FlatList    
				  data={this.state.details}
				  keyExtractor={item => item.index}
                  renderItem={({item, index}) =>       
			      
			<View key={index} style={[styles.cardStyle,{ borderLeftColor:(item.vendorConfirmStatus == "0")?"#61B865":"#E63E3A"}]}>
			
			<View style={{flexDirection:'row'}}>
			  <View style={{width:'50%'}}>
			    <Text style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15}}>Inspector Id</Text>
			    <Text style={{color:'#000000',  fontSize:13}}>{item.inspectorUnqId}</Text>
			  </View> 
			   
			  <View  style={{width:'50%'}}>
			    <Text  style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15, textAlign:'right'}}>Inspector Name</Text>
			    <Text  style={{color:'#000000', fontSize:13, textAlign:'right'}}>{item.inspectorName}</Text>
			  </View>       
			</View>

			<View style={{flexDirection:'row', marginTop:10}}>
			  <View style={{width:'50%'}}>
			    <Text style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15}}>Proposed Inspection Date</Text>
			    <Text style={{color:'#000000',  fontSize:13}}>{dateFormat(item.inspectionDate, "dd-mm-yyyy")}</Text>
			  </View> 
			   
			  <View  style={{width:'50%'}}>
			    <Text  style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15, textAlign:'right'}}>Time of Arival</Text>
			    <Text  style={{color:'#000000', fontSize:13, textAlign:'right'}}>{item.arrivalTime}</Text>
			  </View>  
			</View>
  
			<View style={{flexDirection:'row', marginTop:10}}>
			  <View style={{width:'50%'}}>
			    <Text style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15}}>Pick Up Location</Text>
			    <Text style={{color:'#000000',  fontSize:13}}>{item.pickUpLocation}</Text>
			  </View> 
			  
			  <View  style={{width:'50%'}}>
			    <Text  style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15, textAlign:'right'}}>Mode of Travel</Text>
			    <Text  style={{color:'#000000', fontSize:13, textAlign:'right'}}>{item.travelMode}</Text>
			  </View> 
			</View>  

			<View style={{flexDirection:'row', marginTop:15}}>
			  <View style={{width:'50%'}}>
			    <Text style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15}}>Inspector Contact Number</Text>
			    <Text style={{color:'#000000',  fontSize:13}}>{item.inspectorContactNo}</Text>
			  </View> 
			  
			  <View  style={{width:'50%'}}>
			     
			  </View> 
			</View>     
           {(item.vendorConfirmStatus == "0")?
             <TouchableOpacity onPress={()=>{this.getSerialNoDetials(item)}}   style={{borderRadius: 5, backgroundColor: '#418bca', marginVertical:15}}>
				<Text style={{fontSize:18, color:'#ffffff', fontFamily:'GoogleSans-Medium', paddingVertical:10, textAlign:'center', elevation:5}}>CONFIRM</Text>
			 </TouchableOpacity>:null} 	
            </View>			          
					                    
			  }         
		   />:
		   <View style={{justifyContent:'center', height:100}}>                     
            <Text style={{fontFamily:'GoogleSans-Medium', fontSize:15}}>No Data Found</Text>	        
	       </View> }   
            
            

       <Modal  
          transparent={true} 
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.closeModal();
          }}>
		  <View onPress={()=>this.closeModal()} style={{ flex: 1,  justifyContent: 'center', alignItems: 'center',backgroundColor:'#00000080'}}>
			   {
				(this.state.showSrNo==true)?
			<View style={{ width: '80%', backgroundColor:'#ffffff',padding:15,borderRadius:10}}>
		     
			   <Text style={{textAlign:'center', color:'#ff7f00', fontFamily:'GoogleSans-Medium', fontSize:18}}>Please Update and Confirm</Text> 

			  
			   {
				   (this.state.qtystatus=="Y")?
				   <View style={{ marginTop:15}}>
					<View style={{}}>
					<Text style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15}}>Site Offer Quantity : </Text>  
					</View>
					

					<View style={{}}>   
					<TextInput
						style={{marginTop:5, borderWidth:1, borderColor:'#418bca', padding:5}}
						onChangeText={(siteofferQty) => this.setState({siteofferQty})}
						value={this.state.siteofferQty}
						//underlineColorAndroid='#ff7f00' 
					/> 
					<Text>Remaing Quantity: {this.state.item.balanceQty}</Text> 
					</View>                      
					</View>
					:null
			   }	       

		        <View style={{marginTop:15}}>
		        <View style={{}}>
			     <Text style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15}}>Start Serial No :  </Text>  
			    </View>
			     <View style={{}}>
				  <TextInput
					 style={{marginTop:5, borderWidth:1, borderColor:'#418bca', padding:5}}
					 onChangeText={(packStartSrno) => this.setState({packStartSrno})}
					 value={this.state.packStartSrno}
				     underlineColorAndroid='transparent' 
				  />   
				 </View>                     
		        </View>	 

		        <View style={{marginTop:15}}>
			     <View style={{}}>
			      <Text style={{color:'#000000', fontFamily:'GoogleSans-Medium', fontSize:15}}>End Serial No : </Text> 
			     </View> 
			     <View style={{}}>
				  <TextInput
					 style={{marginTop:5, borderWidth:1, borderColor:'#418bca', padding:5}}
					 onChangeText={(packEndSrno) => this.setState({packEndSrno})}
					 value={this.state.packEndSrno}
				     underlineColorAndroid='transparent' 
				  /> 
				  </View>                           
		        </View>

				 <View style={{borderWidth:0, borderRadius:5, marginVertical:10, padding:10, backgroundColor:'#FEC1A5'}}>
				    <View style={{ alignItems:'center'}}>
					<Text style={{fontSize:15, fontFamily:'GoogleSans-Medium', paddingTop:10, color:'black', textAlign:'center'}}>Click to Upload Packing List</Text>
					<TouchableOpacity onPress={()=>this.onCamera()} style={{padding:10, borderRadius:5, backgroundColor:'brown', marginVertical:10}}>
					 <Icon name="camera" size={25} color="white" />  
					</TouchableOpacity>  
				    </View>  
					
					  
					<View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
				    {this.state.image.map((item)=>
					  <Icon name="file-text" size={30} color="#141F25" />
				     )}  
				   	</View> 
			     		
				   </View>
              
              {(this.state.isRefreshing==true)?<ActivityIndicator size="small" color="#000000" style={{marginTop:10}}/>: 
               <View style={{flexDirection:'row', justifyContent:'space-between', marginVertical:20}}>
				 <TouchableOpacity onPress={()=>this.addOfferQty()} style={{borderRadius: 5, backgroundColor: '#3CB043',}}>
					<Text style={{fontSize:15, color:'#ffffff', fontFamily:'GoogleSans-Medium', paddingVertical:10, paddingHorizontal:20, elevation:5}}>Yes</Text>
				  </TouchableOpacity>  
				  <TouchableOpacity  onPress={()=>this.setState({modalVisible:false})}  style={{borderRadius: 5, backgroundColor: 'red'}}>
					<Text style={{fontSize:15, color:'#ffffff', fontFamily:'GoogleSans-Medium', paddingVertical:10, paddingHorizontal:20, elevation:5}}>No</Text>
				  </TouchableOpacity> 
                </View>}  
			
               <TouchableOpacity onPress={()=>this.closeModal()} style={{position:'absolute', top:0, right:5}}>
		         <Icon name="x" size={25} color="black" />  
		       </TouchableOpacity>  
			  
             </View>:
             <View style={{ width: '80%', backgroundColor:'#ffffff',padding:15,borderRadius:10}}>
             	<Text style={{textAlign:'center', color:'#ff7f00', fontFamily:'GoogleSans-Medium', fontSize:18}}>Do you want to confirm inspection ?</Text> 
               
               {(this.state.isRefreshing==true)?<ActivityIndicator size="small" color="#000000" style={{marginTop:10}}/>: 
               <View style={{flexDirection:'row', justifyContent:'space-between', marginVertical:20}}>
				 <TouchableOpacity onPress={()=>this.addOfferQty()} style={{borderRadius: 5, backgroundColor: '#3CB043',}}>
					<Text style={{fontSize:15, color:'#ffffff', fontFamily:'GoogleSans-Medium', paddingVertical:10, paddingHorizontal:20, elevation:5}}>Yes</Text>
				  </TouchableOpacity>  
				  <TouchableOpacity  onPress={()=>this.setState({modalVisible:false})}  style={{borderRadius: 5, backgroundColor: 'red'}}>
					<Text style={{fontSize:15, color:'#ffffff', fontFamily:'GoogleSans-Medium', paddingVertical:10, paddingHorizontal:20, elevation:5}}>No</Text>
				  </TouchableOpacity> 
                </View>} 
                <TouchableOpacity onPress={()=>this.closeModal()} style={{position:'absolute', top:0, right:5}}>
		         <Icon name="x" size={25} color="black" />  
		       </TouchableOpacity> 
             </View>
             }
		   </View>    
          </Modal>  	         


		</View>   
	  </ScrollView>     
     </ImageBackground>	      
    );               
  }    
}               

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
   
  },
  cardStyle:{
   margin:15, borderRadius:5, elevation:8, backgroundColor:'#ffffff', padding:15, borderLeftWidth:5
  },
    tableHeader:{
	 flexDirection:'row', backgroundColor:'#000000', borderBottomColor:'lightgrey', borderBottomWidth:1	
	},
	tableHeaderText:{
     paddingVertical:10, fontFamily:'GoogleSans-Medium', color:'#ffffff', textAlign:'center',  borderRightColor:'lightgrey', borderRightWidth:1, 
	},
	tableContent:{
	 flexDirection:'row', backgroundColor:'#ffffff', borderBottomColor:'lightgrey', borderBottomWidth:1	
	},
	tableContentText:{
	  color:'black', borderRightColor:'lightgrey', textAlign:'center', borderRightWidth:1,	fontSize:14,paddingVertical:10,
	},      
	button:{
     borderRadius: 5, backgroundColor: '#ff7f00', marginTop:20, paddingVertical:10, paddingHorizontal:20	
	},
	buttonText:{
     fontSize:18, color:'#ffffff', fontFamily:'GoogleSans-Medium',	
	},
	detailsView:{
	  borderWidth:1, margin:15, padding:15, backgroundColor:'#FEC1A5', elevation:8, borderColor:'transparent'
	}
});  
  