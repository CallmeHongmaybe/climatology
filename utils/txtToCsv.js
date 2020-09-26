const fs = require('fs')

const writeStream = fs.createWriteStream('/Users/quanvihong/Desktop/city+climates.csv', {flags: 'a'})

// create a read stream first 
fs.readFile('/Users/quanvihong/Desktop/cityClimates.txt', {encoding: 'utf-8'}, (err, data) => {
     if (err) console.log(err); 
     else {
         const dataArray = data.split('\r\n')
         for (let i = 0; i < dataArray.length - 1; i++) { 
            writeStream.write(`${dataArray[i]}\n`, (error) => error ? console.log(error) : console.log(`Row ${i} finished`))
         }
     }
}) 


