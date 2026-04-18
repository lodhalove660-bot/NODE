const express  = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized:false
    }
});
const PORT = process.env.PORT || 5000;

app.get('/',async(req,res)=>{
   try{
        res.json({message:"CONNECTED SUCCESSFULLY.....!"});
   }catch(err){
        res.status(500).json({error:err.message});
   }
});

app.get('/region',async(req,res)=>{
    try{
        const result = await pool.query('select * from regions')
        res.json(result.rows)
    }catch(err){
        res.status(500).json({error:err.message})
    }
})

app.get('/country',async(req,res)=>{
    try{
        const result = await pool.query(`select country_id,country_name,region_name 
            from countries,regions where countries.region_id = regions.region_id`)
        res.json(result.rows)
    }catch(err){
        res.status(500).json({error:err.message})
    }
})

app.get('/employee',async(req,res)=>{
    try{
        const result = await pool.query(`select e.employee_id,concat_ws(' ',e.first_name,e.last_name) as FullName,
            e.email,e.salary,e.phone_number,e.hire_date,e.commission_pct,concat_ws(' ',m.first_name,m.last_name) as ManagerFullName,
            j.job_title,d.department_name
            from employees e full outer join employees m on  e.manager_id=m.employee_id
            join departments d on d.department_id = e.department_id 
            join jobs j on j.job_id = e.job_id`)
        res.json(result.rows)
    }catch(err){
        res.status(500).json({error:err.message})
    }
})


app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})