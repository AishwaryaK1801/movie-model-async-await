const cl = console.log;

const showModel = document.getElementById("showModel");
const backDrop = document.getElementById("backDrop");
const productModel = document.getElementById("productModel");
const productContainer = document.getElementById("productContainer");
const closeModelBtns = [...document.querySelectorAll(".closeModel")];
const productForm = document.getElementById("productForm");
const titleControl = document.getElementById("title");
const imgUrlControl = document.getElementById("imgUrl");
const descriptionControl = document.getElementById("description");
const statusControl = document.getElementById("status");

const addProduct = document.getElementById("addProduct");
const updateProduct = document.getElementById("updateProduct");
const loader = document.getElementById("loader");


const showHideLoader=()=>{
    loader.classList.toggle("d-none");
}


const snackBarMsg =(msg, icon, time)=>{
    Swal.fire({
        title : msg,
        icon : icon,
        timer : time
    })
}

const objToArr = (obj)=>{
    let postArr=[];
    for(const key in obj){
        postArr.push({...obj[key], productId: key})
    }
    return postArr;
}

const baseUrl = `https://async-await-2-default-rtdb.asia-southeast1.firebasedatabase.app`;
const postUrl =`${baseUrl}/posts.json`;

const modelBackDropHide =()=>{
    productForm.reset();
    productModel.classList.remove("active");
    backDrop.classList.remove("active");
    updateProduct.classList.add("d-none");
    addProduct.classList.remove("d-none");
}

const modelBackDropShow =()=>{
    productModel.classList.add("active");
    backDrop.classList.add("active");

}

showModel.addEventListener("click", modelBackDropShow);
closeModelBtns.forEach(btn=>{
    btn.addEventListener("click", modelBackDropHide);
})

const templatingOfProducts = (arr)=>{
    let result =``;

    arr.forEach(obj=>{
        result+=
        ` <div class="col-md-3">
        <div class="card mb-4">
            <figure class="productCard mb-0" id="${obj.productId}">
                <img src="${obj.imgUrl}" alt="${obj.title}" title="${obj.title}">
                <figcaption>
                <div class="statusSection">
                <div class="row">
                    <div class="col-8"><h3 class="mb-0 productTitle">${obj.title}</h3>
                    </div>
                        
                        <div class="col-4">
                            <div class="text-center">
                            
                                ${obj.status==='ordered' ? `<p class="bg-warning">${obj.status}</p>`:
                                obj.status==='dispatched' ? `<p class="bg-info">${obj.status}</p>`:
                                obj.status==='In-transit' ? `<p class="bg-secondary">${obj.status}</p>`:
                                obj.status==='delivered' ? `<p class="bg-success">${obj.status}</p>`:
                                 `<p class="bg-success">${obj.status}</p>`
                            }
                        
                        </div>
                        </div>
                    
                </div>
            </div>
                    <div class="descrSection">
                        <h4>${obj.title}</h4>
                        <em>product description</em>
                        <p>
                        ${obj.description}
                        </p>
                        <div class="action">
                            <button class="btn btn-info" onClick="onEdit(this)">Edit</button>
                            <button class="btn btn-danger" onClick="onDelete(this)">Delete</button>
                        </div>
                    </div>

                </figcaption>
            </figure>
        </div>
    </div>
        
        `
       
    })
    productContainer.innerHTML=result;
}


const onEdit =async(ele)=>{
try{
    let editId=ele.closest(".productCard").id;
    cl(editId);
    localStorage.setItem("editId", editId);
    let editUrl = `${baseUrl}/posts/${editId}.json`;
    let res= await makeApiCall("GET", editUrl);
    titleControl.value=res.title;
    imgUrlControl.value= res.imgUrl;
    descriptionControl.value=res.description;
    statusControl.value=res.status;
    
    addProduct.classList.add("d-none");
    updateProduct.classList.remove("d-none");
    modelBackDropShow();
}
catch(err){
cl(err)
}
}

const onDelete =async(ele)=>{
let deleteId = ele.closest(".productCard").id;
cl(deleteId);
let deleteUrl =`${baseUrl}/posts/${deleteId}.json`;

let getConfirmation = await Swal.fire({
    title: "Do you want to remove this product?",
    // showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Yes",
    // denyButtonText: `Don't save`
  })
  if(getConfirmation.isConfirmed){
    let res = await makeApiCall("DELETE", deleteUrl);
    ele.closest(".col-md-3").remove();
    snackBarMsg("product deleted successfully !", "success", 3000); 
  }

}

const makeApiCall = async(methodName, apiUrl, msgBody)=>{
    showHideLoader();
   try{
    msgBody = msgBody ? JSON.stringify(msgBody) : null;
    let res= await fetch(apiUrl,{
        method : methodName,
        body : msgBody
    })
    return res.json();
   }
   catch(err){
    cl(err);
   }
   finally{
    showHideLoader();
   }
}

const fetchPosts = async ()=>{
    try{
        let res = await makeApiCall("GET", postUrl);
        let arr = objToArr(res);
        templatingOfProducts(arr.reverse());
    }
    catch(err){
        cl(err)
    }
    
}
fetchPosts();

const createCard = (obj)=>{
    let card = document.createElement("div");

    card.className="col-md-3";
    card.innerHTML =
                `  <div class="card mb-4">
                <figure class="productCard mb-0" id="${obj.productId}">
                    <img src="${obj.imgUrl}" alt="${obj.title}" title="${obj.title}">
                    <figcaption>
                    <div class="statusSection">
                        <div class="row">
                            <div class="col-8"><h3 class="mb-0 productTitle">${obj.title}</h3>
                            </div>
                                
                                <div class="col-4">
                                    <div class="text-center">
                                    
                                        ${obj.status==='ordered' ? `<p class="bg-warning">${obj.status}</p>`:
                                        obj.status==='dispatched' ? `<p class="bg-info">${obj.status}</p>`:
                                        obj.status==='In-transit' ? `<p class="bg-secondary">${obj.status}</p>`:
                                        obj.status==='delivered' ? `<p class="bg-success">${obj.status}</p>`:
                                        `<p class="bg-success">${obj.status}</p>`
                                    }
                                
                                </div>
                                </div>
                            
                        </div>
                    </div>
                        <div class="descrSection">
                            <h4>${obj.title}</h4>
                            <em>product description</em>
                            <p>
                            ${obj.description}
                            </p>
                            <div class="action">
                                <button class="btn btn-info" onClick="onEdit(this)">Edit</button>
                                <button class="btn btn-danger" onClick="onDelete(this)">Delete</button>
                            </div>
                        </div>
    
                    </figcaption>
                </figure>
            </div>
                    `;
                    productContainer.prepend(card);      
}


const onProductSubmit =async(eve)=>{
    eve.preventDefault();
    let obj ={
        title : titleControl.value,
        imgUrl : imgUrlControl.value,
        description : descriptionControl.value,
        status : statusControl.value
    }
    try{
        let res = await makeApiCall("POST", postUrl, obj);
        cl(res);
        obj.productId = res.name;
        createCard(obj)

        snackBarMsg("Product is added successfully", "success", 3000)
    }
    catch(err){
        cl(err)
    }
    finally{
        modelBackDropHide();
    }
    
}

const onProductUpdate =async()=>{
    try{
        let updateId = localStorage.getItem("editId");
        cl(updateId)
        let updateUrl =  `${baseUrl}/posts/${updateId}.json`;
        let obj ={
            title : titleControl.value,
            imgUrl : imgUrlControl.value,
            description : descriptionControl.value,
            status : statusControl.value,
            id : updateId
        }
        let res= makeApiCall("PATCH", updateUrl, obj)
        cl(res)
        let card = document.getElementById(updateId);
        card.innerHTML=
        ` <img src="${obj.imgUrl}" alt="${obj.title}" title="${obj.title}">
                <figcaption>
                <div class="statusSection">
                                <div class="row">
                                    <div class="col-8"><h3 class="mb-0 productTitle">${obj.title}</h3>
                                    </div>
                                        
                                        <div class="col-4">
                                            <div class="text-center">
                                            
                                                ${obj.status==='ordered' ? `<p class="bg-warning">${obj.status}</p>`:
                                                obj.status==='dispatched' ? `<p class="bg-info">${obj.status}</p>`:
                                                obj.status==='In-transit' ? `<p class="bg-secondary">${obj.status}</p>`:
                                                obj.status==='delivered' ? `<p class="bg-success">${obj.status}</p>`:
                                                `<p class="bg-success">${obj.status}</p>`
                                            }
                                        
                                        </div>
                                        </div>
                                    
                                </div>
                            </div>
                    <div class="descrSection">
                        <h4>${obj.title}</h4>
                        <em>product description</em>
                        <p>
                        ${obj.description}
                        </p>
                        <div class="action">
                            <button class="btn btn-info" onClick="onEdit(this)">Edit</button>
                            <button class="btn btn-danger" onClick="onDelete(this)">Delete</button>
                        </div>
                    </div>

                </figcaption>
        `;
        snackBarMsg("product is updated successfully !", "success", 3000)
    }
    catch(err){
        cl(err)
    }
    finally{
        productForm.reset();
        addProduct.classList.remove("d-none");
        updateProduct.classList.add("d-none");
        modelBackDropHide();
    }
}


productForm.addEventListener("submit", onProductSubmit);
updateProduct.addEventListener("click", onProductUpdate);
















/*                              <div class="col-md-4 text-center">
                                       <div class="text-center">
                                       ${obj.status === ordered ? `<p class="bg-warning">${obj.status}</p>`:
                                       obj.status === dispached ? `<p class="bg-info">${obj.status}</p>`:
                                       obj.status=== In-transit ? `<p class="bg-secondary">${obj.status}</p>`:
                                       obj.status=== delivered ? `<p class="bg-secondary">${obj.status}</p>`:
                                        `<p class==="bg-info">${obj.status}</p>`
                                       }
                                       </div>
                                    </div> */