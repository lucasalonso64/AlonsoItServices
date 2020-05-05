const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose);



const Chamado = new Schema({
 
    assunto: {
        type: String,
        required: true
    },   

    descricao: {
        type: String,
       // required: true
    },    

    numero: {
        //type: Number,
       // required: true,
        seq: {type: Number, default: 0}
    },
    catchamados: {
        type: Schema.Types.ObjectId,
        ref: "catchamados",
        required: true
    },

    created: {
        type: Date,
        default: Date.now()
    }
    

})

Chamado.plugin(AutoIncrement, {inc_field: 'numero'});

mongoose.model("chamado", Chamado)