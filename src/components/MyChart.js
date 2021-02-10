import React, { Component } from 'react'
import axios from "axios"
import chart from 'chart.js'


class MyChart extends React.Component {
    state={
        chartLabels: "",
        chartData: "",
        ctx: "",
        chart: "",
        startDate: '',
        endDate: '',
        initiated: false,
    }

    async componentDidMount() { // Executa ao carregar a página
        try {
            
            const url ="http://api.coindesk.com/v1/bpi/historical/close.json"
            const imp = await axios.get(url) // Passo 1: "Get" dos dados base do gráfico
            
            let labels=Object.keys(imp.data.bpi);
            let data=Object.values(imp.data.bpi);
            
            this.setState({chartLabels: labels, chartData: data, initiated: true}); // Passo 2: Atualiza as variáveis locais que guardam os dados do gráfico
            this.setState({ctx: document.getElementById('myChart').getContext('2d')});
        } catch (err) {
            console.log(err)
        }
    }


    // Roda toda vez que o state é atualizado
    async componentDidUpdate(prevProps, prevState) { // Passo 3-infty: Atualiza o gráfico de acordo com a atualização do "State" 

        if( this.state.initiated || prevState.startDate !== this.state.startDate || prevState.endDate !== this.state.endDate){
            try {
                const url = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${this.state.startDate}&end=${this.state.endDate}` 
                const imp = await axios.get(url) // Passo 3.1: "Get" dos dados pedidos pelo usuário
                
                let labels=Object.keys(imp.data.bpi);
                let data=Object.values(imp.data.bpi);
    
                this.setState({chartLabels: labels, chartData: data}); // Passo 3.2: Atualiza o State de acordo com os dados recuperados pelo .get
    
            } catch (err) {
                console.log(err)
            }
       
        const graph = { // Passo 3.4: Atualiza a variável do gráfico com os dados correspondentes
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: this.state.chartLabels,
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: this.state.chartData
                }]
            },
        
            // Configuration options go here
            options: {}
        }
        
        this.setState({chart: new chart(this.state.ctx, graph), initiated: false}) // Passo 3.5: Atualizar o gráfico para renderizar para o usuário
    }
    }

    handleChange = (event) => { // Passo 4-infty: Atualiza o "State" de acordo com o input do usuário
        this.setState({[event.target.name]: event.target.value})
       
    }



    render() {
        return(<div>
        <div className = "d-flex">
            <input name = "startDate" onChange = {this.handleChange} type = "date"></input>
            <input name = "endDate" onChange = {this.handleChange} type = "date"></input>
        </div>
        <canvas id="myChart"></canvas>
        </div>)
    }
}

export default MyChart