const displayCard = document.querySelector('.instructor-card')
const container = document.querySelector('.schedule-container')

const template = document.getElementById('template')

const title_date = document.querySelector('.current-date')

const managersOnSchedule = document.querySelector('.num_of_managers')


const mobileNumber =document.querySelector('.mobile-num')
const studioNumber = document.querySelector('.studio-num')

const numberOnSchedule = document.querySelector('.number-on-schedule')

const numberAvailable = document.querySelector('.number-available')





 




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

    const response = await fetch('https://ism-schedule-backend.onrender.com/',{method  :'POST',
        headers:{
            'Content-Type': 'application/JSON'
        },
        body: JSON.stringify({current_date:today})

       
     
    })

    //clearing the container and default text content of relevant elements

    container.innerHTML = " "

    managersOnSchedule.textContent = " "

    title_date.textContent=" "

    numberAvailable.textContent =" "

    numberOnSchedule.textContent = " "


    //convert data from database to JSON


    const data = await response.json()


    //Appending counts of instructors on schedule and today's date to the DOM

    title_date.textContent = `${dateToday.toLocaleDateString('en-US', { month: 'long' })} ${new Date().getDate()}`

    managersOnSchedule.textContent = `${data.length}`



    let numAvailable = 0
    let numOnSchedule = data.length

    // Creating cards to be appended to the DOM

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

        const studioAccentContainer = card.querySelector('.initials-container')


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

        // Manager's start time
        const [startHour, startMinutes] = item.shift_start.split(':')
        const shiftStart =
            Number(startHour) * 60 + Number(startMinutes)

        // Manager's end time
        const [endHour, endMinutes] = item.shift_end.split(':')
        const shiftEnd =
            Number(endHour) * 60 + Number(endMinutes)

        // Determine status
        if (shiftStart < currentTime && currentTime < shiftEnd) {

            status.textContent = 'Available'
            status.classList.add('bg-green-500')

            numAvailable++

        } else {

            status.textContent = 'On schedule'
            status.classList.add('bg-blue-500')

            

        }

        if (studioAccentContainer){
            studioAccentContainer.style.backgroundColor = getSoftRandomColor()
        }

        

       


        container.append(card)

        
     });

     numberAvailable.textContent = numAvailable

     numberOnSchedule.textContent = numOnSchedule
}




function getSoftRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 35 + Math.floor(Math.random() * 15); // 35% - 50%
    const lightness = 85 + Math.floor(Math.random() * 10);  // 85% - 95%

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

document.addEventListener('DOMContentLoaded', initiateRecordsRetrieval)



