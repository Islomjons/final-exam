let elPerrotsWrapper = document.querySelector(".perrots__wrapper");
let elForm = document.querySelector("#input__form");
let elInputSearch = document.querySelector(".input__search");
let elInputFrom = document.querySelector(".input__number");
let elInputTo = document.querySelector(".input__to");
let elInputWidthFrom = document.querySelector(".from__width");
let elInputWidthTo = document.querySelector(".to__width");
let elInputHeightFrom = document.querySelector(".from__height");
let elInputHeightTo = document.querySelector(".to__height");
let elSelectPrice = document.querySelector(".select__price");
let elFilterBtn = document.querySelector("#filter__btn");
let elLoadingWrapper = document.querySelector(".loading__wrapper");
let elEditForm = document.querySelector(".edit__form");
let elModalTitle = document.querySelector("#addParrotTitle");
let elModalBtn = document.querySelector(".modalBtn");
let elAddParrot = document.querySelector(".add__parrot");
let elModalBody = document.querySelector(".modal-body")
let elResultCount = document.querySelector("#resultCount")
let elParrotsTemp = document.querySelector("#parrots__temp");

let apiParrots = "http://167.235.158.238/parrots";
let Parrots = [];

function renderParrots() {
    elResultCount.textContent = `Search result${Parrots.length}`
    Parrots.forEach(parrot => {
        let parrotsTemp = elParrotsTemp.cloneNode(true).content;
        let {id, title, img, price, birthDate, sizes, isFavorite, features} = parrot;
        
        let cardImg = parrotsTemp.querySelector(".cardImg");cardImg.src = img;
        let cardTitle = parrotsTemp.querySelector(".cardTitle");cardTitle.textContent = title;
        let cardPrice = parrotsTemp.querySelector(".cardPrice");cardPrice.textContent = price;
        let cardDate = parrotsTemp.querySelector(".cardDate");cardDate.textContent = new Date(birthDate).toDateString();
        let cardEditId = parrotsTemp.querySelector(".editBtn");cardEditId.dataset.editId = id;
        let cardDeleteId = parrotsTemp.querySelector(".deleteBtn");cardDeleteId.dataset.deleteId = id;
        
        let cardFeature = parrotsTemp.querySelector(".list");
        let cardParrotFeature = features.split(",");
        cardParrotFeature.forEach(feature => {
            let newLi = document.querySelector("li")
            newLi.className = "badge bg-primary me-1 mb-1";
            newLi.textContent = feature;
            cardFeature.appendChild(newLi)
        });
        elPerrotsWrapper.appendChild(parrotsTemp)
    });
}

let showAlertError = function(alertWrapper, errMsG) {
    let newP = document.querySelector("p")
    newP.textContent =  errMsG || "Xatolik yuz berdi"
    newP.className = "alert alert-danger"
    alertWrapper.appendChild(newP)
}

let newPara = document.createElement("p")
newPara.className = "loader"
elLoadingWrapper.prepend(newPara)

fetch(apiParrots)
.then((res) => {
    if (res.status === 200) {
        return res.json()
    }
    return Promise.reject(res)
})
.then((data) => {
    Parrots = data
    renderParrots(Parrots)
    console.log(Parrots);
})
.catch((err) => {
    if (err.status === 404) {
        return showAlertError(elLoadingWrapper, "Hech narsa topilmadi 404")
    }
    showAlertError(elLoadingWrapper, "Xatolik yuz bedi")
})
.finally(() => {
    newPara.remove()
})

elForm.addEventListener("submit", function(evt) {
    evt.preventDefault()
    
    let inputSearch = elInputSearch.value.trim();
    let inputFrom = elInputFrom.value.trim();
    let inputTo = elInputTo.value.trim()
    let selectPrice = elSelectPrice.value.trim()
    

    let orderIncludes = selectPrice.includes("&_order=")
    let splittedValueSort = selectPrice.split("&_order=") 
    elFilterBtn.disabled = true
    
    fetch(`${apiParrots}?${new URLSearchParams({
        title_like: inputSearch,
        price_gte: inputFrom,
        _sort: orderIncludes ? splittedValueSort[0] : selectPrice,
        _order: orderIncludes ? splittedValueSort[1] : "asc"
    })}`
    )
    .then((ress) => {
        if (ress.status === 200) {
            return ress.json()
        }
        return Promise.reject(ress)
    })
    .then((filterParrots) => {
        renderParrots(filterParrots)
    })
    .catch(() => {
        return showAlertError(elLoadingWrapper, "Filterda xatolik yuz berdi")
    })
    .finally(() => {
        elFilterBtn.disabled = false
    })
})

elPerrotsWrapper.addEventListener("click", function(evt) {
    if (evt.target.matches(".deleteBtn")) {
        let deletesId = +evt.target.dataset.deleteId
        evt.target.disabled = true
        fetch(`${apiParrots}/${deletesId}`,{
            method: "DELETE"
        })
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            }
            return Promise.reject(res)
        })
        .then(() => {
            let deleteIndex = Parrots.findIndex(function(item) {
                return item.id == deletesId
            })
            Parrots.splice(deleteIndex, 1)
            renderParrots(Parrots)
        })
        .catch(() => {
            evt.target.disabled = false
            showAlertError(elLoadingWrapper, "Ochirish mobaynida xatolik tuz berdi")
        })
    }
    
    if (evt.target.matches(".editBtn")) {
        let editIddd = +evt.target.dataset.editId
        let editParId = Parrots.find(function(item) {
            return item.id == editIddd
        })
        
        let {
            title,
            img,
            price,
            birthDate,
            sizes: { width, height },
            features,
        } = editParId;
        
        let parrotTile = document.querySelector("#parrot__title")
        let parrotImg = document.querySelector("#parrot__img");
        let parrotPrice = document.querySelector("#parrot__price");
        let parrotDate = document.querySelector("#parrot__date");
        let parrotWidth = document.querySelector("#parrot_width");
        let parrotHeight = document.querySelector("#parrot_height");
        let featuresParrot = document.querySelector("#features__parrot")
        parrotTile.value = title;
        parrotImg.value = img;
        parrotPrice.value = price;
        parrotDate.value = birthDate;
        parrotWidth.value = width;
        parrotHeight.value = height;
        featuresParrot.value = features;
        
        elModalTitle.textContent = "Edit parrot"
        elModalBtn.textContent = "Edit parrot"
    }
})

elAddParrot.addEventListener("click", function() {
    elModalTitle.textContent = "Add parrots"
    elModalBtn.textContent = "Add parrots"
})

elEditForm.addEventListener("click", function(evt) {
    evt.preventDefault()
    
    let {
        parrot__title: {value: parrotTitle},
        parrot__img: {value: parrotImg},
        parrot__price: {value: parrotPrice},
        parrot__date: {value: parrotDate},
        parrot__width: {value: parrotWidth},
        parrot__height: {value: parrotHeight},
        features__parrot: {value: parrotFeature}
    } = elEditForm
    
    if (parrotTitle.trim() && parrotPrice.trim() && parrotDate.trim() && parrotWidth.trim() && parrotHeight.trim() && parrotFeature.trim()) {
        let addNewParrot = {
            id:  Math.floor(Math.random() * 1000),
            title: parrotTitle,
            img: parrotImg,
            price: parrotPrice,
            birthDate: parrotDate,
            sizes: {
                width: parrotWidth,
                height: parrotHeight,
            },
            isFavorite: false,
            features: parrotFeature
        }
        
        elModalBtn.disabled = true;
        elModalBtn.textContent = `Adding ${parrotTitle}`
        
        let {editId} = elEditForm.dataset
        if (!editId) {
            fetch(apiParrots, {
                method: "POST",
                body: JSON.stringify(addNewParrot),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((res) => {
                if (res.status === 201) {
                    return res.json()
                }
                return Promise.reject(res)
            })
            .then((data) => {
                Parrots.push(data)
                renderParrots(Parrots)
            })
            .catch(() => {
                showAlertError(elModalBody, `${parrotTitle} sa xatolik yuz berdi`)
            })
            .finally(() => {
                elModalBtn.disabled = false
            })
        }else{
            let parrotsIdNum = +editId
            addNewParrot.id == parrotsIdNum
            let parrotIndex = Parrots.find(function(item) {
                return item.id == parrotsIdNum
            })
            Parrots.splice(parrotIndex, 1, addNewParrot)
            fetch(`${apiParrots}/${parrotsIdNum}`, {
                method: "PUT",
                body: JSON.stringify(addNewParrot),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((res) => {
                if (res.status === 201) {
                    return res.json()
                }
                return Promise.reject(res)
            })
            .then((data) => {
                Parrots.push(data)
                renderParrots(Parrots)
            })
            .catch(() => {
                showAlertError(elModalBody, "Edit bolyotganda xatolik yuz berdi")
            })
        }
        parrot__title.value = "",
        parrot__img.value = "",
        parrot__price.value = "",
        parrot__date.value = "",
        parrot__width.value = "",
        parrot__height.value = "",
        features__parrot.value = ""
    }
})