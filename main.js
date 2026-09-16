const displayCard = document.querySelector('.instructor-card')
const container = document.querySelector('.schedule-container')

const template = document.getElementById('template')


const mobileNumber =document.querySelector('.mobile-num')
const studioNumber = document.querySelector('.studio-num')


// grabbing records from backend

//This function sends the current date to the backend in a request to trigger the release of all records for the day

const initiateRecordsRetrieval = async ()=>{

    const dateToday = new Date()


   // formatting datetime from const dateToday

    const today = [
        dateToday.getFullYear(),
        String(dateToday.getMonth() + 1).padStart(2, '0'),
        String(dateToday.getDate()).padStart(2, '0')
    ].join('-');

// sending the date as the body of a request to the backend.

    const response = await fetch('http://127.0.0.1:5000/',{method  :'POST',
        headers:{
            'Content-Type': 'application/JSON'
        },
        body: JSON.stringify({current_date:today})

       
     
    })

    container.innerHTML = " "


    const data = await response.json()

    console.log(data)

     const schduleCard = data.forEach(item => {

        const card = template.content.cloneNode(true)

        const studioInitials = card.querySelector('.studio-initials')

        const managerName = card.querySelector('.name')

        const mobileNumber = card.querySelector('.mobile-num')

        const studioNumber =card.querySelector('.studio-num')

        const mobileNumberLink = card.querySelector('#mobile')


        const studioNumberLink = card.querySelector('#studio')

        const status = card.querySelector('.status')

        const studio_name = card.querySelector('.studio-details')


        studioInitials.textContent = item.studio_initials

        managerName.textContent = item.name

        mobileNumber.textContent = item.mobile_number

        studioNumber.textContent = item.studio_number

        mobileNumberLink.setAttribute('href', `tel:+81${item.mobile_number.slice(1)}`)

        studioNumberLink.setAttribute('href', `tel:+81${item.studio_number.slice(1)}` )
        
        studio_name.textContent = item.studio_name

        const timeNow = new Date()

        const currentTime = timeNow.getHours() *60 + timeNow.getMinutes()

        const hour = timeNow.getHours()

        const minutes = timeNow.getMinutes()

        console.log(currentTime, hour, minutes)


        container.append(card)
        
     });
}


document.addEventListener('DOMContentLoaded', initiateRecordsRetrieval)
