//Carregando os módulo
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/CatChamados")
const CatChamados = mongoose.model('catchamados')
require("../models/Chamado")
const Chamado = mongoose.model('chamado')
const { getTransport, sendEmail } = require('../send-mail')

router.get('/', (req, res) => {
    res.render("admin/index")
})


router.get('/cat-chamados', (req, res) => {
    CatChamados.find().then((catchamados) => {
        res.render("admin/cat-chamados", { catchamados: catchamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria do chamado não foi encontrada!")
        res.render("admin/cat-chamados")
    })

})


router.get('/vis-cat-chamado/:id', (req, res) => {
    CatChamados.findOne({ _id: req.params.id }).then((catchamados) => {

        res.render("admin/vis-cat-chamado", { catchamados: catchamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria do chamado não foi encontrada!")
        res.render("admin/cat-chamados")
    })
})



router.get('/cad-cat-chamado', (req, res) => {
    res.render("admin/cad-cat-chamado")
})


router.post('/add-cat-chamado', (req, res) => {
    var errors = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        errors.push({ error: "Necessário preencher o campo categoria" })
    }

    if (errors.length > 0) {
        res.render("admin/cad-cat-chamado", { errors: errors })

    } else {
        const addCatChamado = {
            nome: req.body.nome
        }
        new CatChamados(addCatChamado).save().then(() => {
            req.flash("success_msg", "Categoria de chamado cadastrada com sucesso!")
            res.redirect('/admin/cat-chamados')

        }).catch((erro) => {
            req.flash("error_msg", "Error: Categoria de chamado não cadastrada com sucesso!")
            res.redirect('/admin/cad-cat-chamado')
        })
    }
})


router.post('/update-cat-chamado', (req, res) => {
    CatChamados.findOne({ _id: req.body.id }).then((catchamados) => {
        catchamados.nome = req.body.nome
        catchamados.save().then(() => {



            req.flash("success_msg", "Categoria de chamado editada com sucesso!")
            res.redirect("/admin/cat-chamados")
        }).catch((erro) => {
            req.flash("error_msg", "Error: Categoria de chamado não encontrada!")
            res.redirect("/admin/cat-chamados")
        })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de chamado não encontrada!")
        res.redirect("/admin/cat-chamados")
    })
})

router.get('/del-cat-chamado/:id', (req, res) => {
    CatChamados.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Categoria de chamado apagado com sucesso!")
        res.redirect('/admin/cat-chamados')
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de chamado não apagada com sucesso!")
        res.redirect("/admin/cat-chamados")
    })
})

router.get('/chamados', (req, res) => {
    Chamado.find().populate("catchamados").then((chamados) => {
        res.render("admin/chamados", { chamados: chamados })

    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.render("admin/chamados")
    })
})

router.get('/vis-chamado/:id', (req, res) => {
    Chamado.findOne({ _id: req.params.id }).populate("catchamados").then((chamado) => {
        res.render("admin/vis-chamado", { chamado: chamado })


        console.log(chamado);
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.render("admin/chamados")
    })

})

router.get('/cad-chamado', (req, res) => {
    CatChamados.find().then((catchamados) => {
        res.render("admin/cad-chamado", { catchamados: catchamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: O formulário cadastrar chamado não pode ser carregado!")
        res.redirect("/admin/chamados")
    })

})

router.post('/add-chamado', (req, res) => {
    var errors = []
    if (!req.body.assunto || typeof req.body.assunto == undefined || req.body.assunto == null) {
        errors.push({ error: "É necessário preencher o campo nome" })
    }
    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        errors.push({ error: "É necessário preencher o campo descrição" })
    }

    if (!req.body.catchamados || typeof req.body.catchamados == undefined || req.body.catchamados == null) {
        errors.push({ error: "É necessário preencher o campo categoria" })
    }

    if (errors.length > 0) {
        res.render("admin/cad-chamado", { errors: errors })

    } else {
        const addChamado = {
            assunto: req.body.assunto,
            descricao: req.body.descricao,
            numero: req.body.numero,
            catchamados: req.body.catchamados
        }
        new Chamado(addChamado).save().then(() => {
                    

              
                // teste de envio de e-mail

                const config = {
                    service: 'gmail',
                    email: 'alonsoitservices@gmail.com',
                    password: 'Teste@123'

                }
                const destination = {
                    remetente: 'alonsoitservices@gmail.com',
                    email: 'alonsosistemas@gmail.com',
                    subject: 'Abertura de chamado'
                }


                const html = `<h2> Seu chamado foi aberto com sucesso. <br>` +
                    `<h3> Categoria: ` + addChamado.assunto + `<br>` +
                    `<h3> Categoria: ` + req.body.catchamados.nome + `<br>` +
                    `<h3> Número: ` + req.body.numero + `<br>` +
                    `<h3> Assunto: ` + req.body.assunto + `<br>` +
                    `<h3> Descrição: ` + req.body.descricao
               // console.log(html)


                const transport = getTransport(config)
                sendEmail(transport)(destination, html)
                    .then(response => console.log(response))
                    .catch(err => console.log(err))
                // fim do teste de envio de e-mal        */


                req.flash("success_msg", "Chamado cadastrado com sucesso ")
                req.flash("success_msg", "E-mail enviado com sucesso!")
                res.redirect('/admin/chamados')

            }).catch((erro) => {
                req.flash("error_msg", "Erro: Chamado não cadastrado")
                res.redirect('/admin/cad-chamdo')
            })
        }
})


router.get('/del-chamado/:id', (req, res) => {
    Chamado.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Chamado apagado com sucesso!")
        res.redirect("/admin/chamados")
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não foi apagado com sucesso!")
        res.redirect("/admin/chamados")
    })
})

//Exportar o módulo de rotas
module.exports = router