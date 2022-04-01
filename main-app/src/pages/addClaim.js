import {Link} from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, setDoc, getDocs, getDoc, query, where, updateDoc, arrayUnion } from "firebase/firestore";
import db, { auth, storage } from "../firebase";
import "../main.css";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useState, useEffect } from "react";
import { async } from "@firebase/util";

function AddClaimPage() {

    function ReloadPageOnce () {
        window.location.reload()
    }

    // const [image, setImage] = useState(null);
    // const [imageName, setImageName] = useState(null)
    // const [imageType, setImageType] = useState(null)

    const [multipleImages, setMultipleImages] = useState([])
    const [multipleImageNames, setMultipleImageNames ] = useState([])
    const [multipleimageTypes, setMultipleImageTypes] = useState([])
    const [length, setLength] = useState(0)
    const [urls, setUrls] = useState([])
    const [docID, setdocID] = useState()
    const [docIDAdmin, setDocIDAdmin] = useState()
    //Auth 
    const auth = getAuth()
    const getUser = auth.currentUser

    // useEffect(() => {
    //     ReloadPageOnce()
    // }, [])

    useEffect(() => { 
        //console.log("EEE: " , urls, " ID:", docID)
        AddURLToDB()
    }, [urls, docID])

    async function AddURLToDB () {
        const auth = getAuth();
        const user = auth.currentUser;

        const writeIntoDocument = doc(collection(db, "Employee"), docIDAdmin)
        const writeIntoDocumentTwo = doc(collection(db, user?.email),  docID)

        // {urls.map((data) => {
        //     data.
        // } )}
        console.log("urls: ", urls)

        await updateDoc( writeIntoDocument, {
            URLS: urls ,
            }
        )
        await updateDoc( writeIntoDocumentTwo, {
            URLS: urls ,
        }
    )
    }

    const UploadImage = async () => {

        const storage = getStorage();           //Access storage

        const arrayOfUrls = []
        for (let i = 0; i < length; i++ ) {
            const storageRef = ref(storage, `${getUser.email}/`+`${multipleImageNames[i]}` )      //If storage file/directory doesnt exist..create one
            const metadata = {
                contentType: `${multipleimageTypes[i]}`,
            }
        
            uploadBytes(storageRef, multipleImages[i], metadata)

            await getDownloadURL(storageRef).then((url) => { 
                //console.log("No ", i, " URL: ", url) 
                arrayOfUrls[i] = url
                //console.log(arrayOfUrls[i])
            })
            console.log(arrayOfUrls[i])    
        }
        setUrls(arrayOfUrls)
    }

    async function AddtoDB(){

        const auth = getAuth();
        const user = auth.currentUser;
    
        const getCollection = collection(db, user?.email)
        const getCollection2 = collection(db, "Employee")

        const generateID = doc(getCollection)                       //Creating new doc
        const generateEmail = doc(getCollection2)

        const generatedId = generateID.id        //Generated ID in variable
        const generatedIdForAdmin = generateEmail.id

        setdocID(generatedId)
        setDocIDAdmin(generatedIdForAdmin)


        const dateNow = Date.now()

        await setDoc(generateID, {                      //individual database
            ID: dateNow,
            ClaimId: generatedId,
            Claim: document.getElementById("title").value,
            Amount: document.getElementById("amount").value,
            Description: document.getElementById("description").value,
            SortCode: document.getElementById("sortcode").value,
            AccountNumber: document.getElementById("accountnumber").value,
            Approve: "",
            URLS: "" ,
            NoFiles: length
        }) 
        await setDoc(generateEmail, {                   //Employee database
            ID: dateNow,
            ClaimId: generatedId ,
            Claim: document.getElementById("title").value,
            Amount: document.getElementById("amount").value,
            Description: document.getElementById("description").value,
            SortCode: document.getElementById("sortcode").value,
            AccountNumber: document.getElementById("accountnumber").value,
            Approve: "",
            email: user.email,
            URLS: "" ,
            NoFiles: length
        })

        /*Reset input fields after submit */
        document.getElementById("title").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("description").value = "";
        document.getElementById("evidence").value = "";
        document.getElementById("sortcode").value = "";
        document.getElementById("accountnumber").value = "";
    }

    const logout = async () => {
        await signOut(auth)
      };
   
    return( 

        <>

        <nav className="navbar">
            <Link className='navbuttons' to="/" >Home</Link>
            <Link className='navbuttons' to="/about" >About</Link>
              <div class="dropdown">
                  <button class="dropbtn">Claims
                   <i class="fa fa-caret-down"></i>
                  </button>
                  <div class="dropdown-content">
                      <Link className='navbuttons' to="/viewClaim" >View Claims</Link>
                      <Link className='navbuttons' to="/addClaim">Add New Claim</Link>
                  </div>
            </div>
            <Link className='loginsignupbutton' to="/LoginSignup" onClick={logout} >Logout</Link> 
          </nav>
          <div class="divider"></div>
        
            <h1>Add Claim</h1>

            <form className="claimform">
                <div className="formbox">
                    <h3>Claim title</h3>
                    <input id="title" type="text" placeholder="Enter claim title " ></input>

                    <h3>Enter Amount</h3>
                    <input id="amount" type="number" placeholder="Enter Amount " ></input>

                    <h3>Description</h3>
                    <input id="description" type="text" placeholder="Enter claim description" ></input>

                    <h3>Sort Code</h3>
                    <input id="sortcode" type="number" placeholder="Enter Sort Code" ></input>

                    <h3>Account Number</h3>
                    <input id="accountnumber" type="number" placeholder="Enter Account Number" ></input>

                    <br></br>
                    <h3>Upload</h3>
                    <input id="evidence" type="file" placeholder="No file uploaded" multiple
                        onChange={(e) => { 
                            let max = e.target.files.length
                            const files = []; const fileNames = []; const fileTypes = []
                            for (var i = 0; i < max; i++){
                                files[i] = e.target.files[i]
                                fileNames[i] = e.target.files[i].name
                                fileTypes[i] = e.target.files[i].type
                            }
                            setMultipleImages(files); 
                            setMultipleImageNames(fileNames)
                            setMultipleImageTypes(fileTypes)
                            setLength(max)
                            }}>
                        </input>
                    <br></br>

                    <input type="button" onClick={() => {  AddtoDB();  UploadImage() }} value={"upload"}></input>
                </div>
            </form>
        </>
    )
}

function StatusOut() {
    return(<h2>Not Logged In!!!</h2>)
}
 
function Status() {                         //Checks if user is logged in and renders based on login status
    const  [loginStatus, setLoginStatus] = useState(false)
  
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {          //Check if user is logged in
      if (user) {
        setLoginStatus(true); 
      } else {
        setLoginStatus(false); 
      }
    })
    return loginStatus
}

const viewClaim = () => {

    return (  
        <div>
                { Status() === true ?  <AddClaimPage/> : <StatusOut/>}
        </div>

    );
}
 
export default viewClaim;