//Carregando os módulo
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/CatChamados")
const CatChamados = mongoose.model('catchamados')
require("../models/Chamado")
const Chamado = mongoose.model('chamado')

require("../models/StatusChamado");
const StatusChamado = mongoose.model('statuschamado')
require('dotenv').config()

const { getTransport, sendEmail } = require('../send-mail')

router.get('/', (req, res) => {
   // res.send("/teste")
    res.render("admin/chamados")
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

// Visualizar status chamado
router.get('/vis-status-chamado/:id', (req, res) => {
    StatusChamado.findOne({ _id: req.params.id }).then((status) => {
        res.render("admin/vis-status-chamado", { status: status })
        console.log(status)
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria do chamado não foi encontrada!")
        res.render("admin/status")
    })
  
})

router.get('/cad-cat-chamado', (req, res) => {
    res.render("admin/cad-cat-chamado")
})

// Status do chamado

router.get('/cad-statuschamado', (req, res) => {
    res.render("admin/cad-statuschamado")
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


// Cadastro de status

router.post('/add-status-chamado', (req, res) => {
    var errors = []
    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        errors.push({ error: "Necessário preencher o campo status" })
    }
    if (errors.length > 0) {
        res.render("admin/cad-statuschamado", { errors: errors })
    } else {
        const addStatus = {
            descricao: req.body.descricao
        }
        new StatusChamado(addStatus).save().then(() => {
            req.flash("success_msg", "Status de chamado cadastrado com sucesso!")
            res.redirect('/admin/status')

        }).catch((erro) => {
            req.flash("error_msg", "Error: Status de chamado não cadastrado com sucesso!")
            res.redirect('/admin/status')
        })
    }
})

// Editar o status chamado
router.post('/update-status-chamado', (req, res) => {
    StatusChamado.findOne({ _id: req.body.id }).then((status) => {
        status.descricao = req.body.descricao
        status.save().then(() => {
            req.flash("success_msg", "Status de chamado editado com sucesso!")
            res.redirect("/admin/status")
        }).catch((erro) => {
            req.flash("error_msg", "Error: Status de chamado não encontrado!")
            res.redirect("/admin/status")
        })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Status de chamado não encontrado!")
        res.redirect("/admin/status")
    })
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

// Exclusão de status
router.get('/del-status-chamado/:id', (req, res) => {
    StatusChamado.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Status de chamado apagado com sucesso!")
        res.redirect('/admin/status')
    }).catch((erro) => {
        req.flash("error_msg", "Error: Status de chamado não apagada com sucesso!")
        res.redirect("/admin/status")
    })
})

router.get('/chamados', (req, res) => {
    Chamado.find({status: 2}).populate("catchamados").then((chamados) => {
        res.render("admin/chamados", { chamados: chamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.render("admin/chamados")
    })
})


// Status
router.get('/status', (req, res) => {
    StatusChamado.find().populate("statuschamado").then((status) => {
        res.render("admin/status", { status: status })
        console.log(status)
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.render("admin/status")
    })
})

router.get('/meuschamados', (req, res) => {
    Chamado.find({status: 1}).populate("catchamados").then((chamados) => {
        res.render("admin/meuschamados", { chamados: chamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.render("admin/meuschamados")
    })
})

router.get('/chamadosencerrados', (req, res) => {
    Chamado.find({status: 5}).populate("catchamados").then((chamados) => {
        res.render("admin/chamadosencerrados", { chamados: chamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.render("admin/chamadosencerrados")
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

router.get('/vis-chamadoencerrado/:id', (req, res) => {
    Chamado.findOne({ _id: req.params.id }).populate("catchamados").then((chamado) => {
        res.render("admin/vis-chamadoencerrado", { chamado: chamado })
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

router.get('/cad-statuschamado', (req, res) => {
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
            status: 2,
            catchamados: req.body.catchamados
        }
        new Chamado(addChamado).save().then((params) => { 
                  // teste de envio de e-mail
                  const config = {
                    service: 'gmail',
                    email: 'alonsoitservices@gmail.com',
                    password: process.env.PASSWORD
                }
                const destination = {
                    remetente: 'alonsoitservices@gmail.com',
                    email: 'alonsosistemas@gmail.com',
                    subject: 'Abertura de chamado'
                }
                const html = `<h2> Seu chamado foi aberto com sucesso. <br>` +
                                   
                    `<h3> Número: ` + params.numero + `<br>` +
                    `<h3> Assunto: ` + params.assunto + `<br>` +
                    `<h3> Descrição: ` + params.descricao
                console.log(params)
                const transport = getTransport(config)
                sendEmail(transport)(destination, html)
                    .then(response => console.log(response))
                    .catch(err => console.log(err))
                // fim do teste de envio de e-mal        */
            req.flash("success_msg", "Chamado cadastrado com sucesso ")
           // req.flash("success_msg", "E-mail enviado com sucesso!")
            res.redirect('/admin/chamados')
        }).catch((erro) => {
            req.flash("error_msg", "Erro: Chamado não cadastrado")
            res.redirect('/admin/cad-chamdo')
        })
    }
})


router.get('/del-chamado/:id', (req, res) => {
    Chamado.deleteOne({ _id: req.params.id }).then((params) => {
        req.flash("success_msg", "Chamado apagado com sucesso!")
        res.redirect("/admin/chamados")
                          // teste de envio de e-mail
                          const config = {
                            service: 'gmail',
                            email: 'alonsoitservices@gmail.com',
                            password: process.env.PASSWORD
                        }
                        const destination = {
                            remetente: 'alonsoitservices@gmail.com',
                            email: 'alonsosistemas@gmail.com',
                            subject: 'Exclusão de chamado'
                        }
                        const html = `<h2> O chamado `+ params.numero + req.params.numero + ` foi excluído. <br>`             
                        console.log(params)
                        const transport = getTransport(config)
                        sendEmail(transport)(destination, html)
                            .then(response => console.log(response))
                            .catch(err => console.log(err))
                        // fim do teste de envio de e-mal        */
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não foi apagado com sucesso!")
        res.redirect("/admin/chamados")
    })
})


router.get('/edit-cat-chamado/:id', (req, res) => {
    CatChamados.findOne({ _id: req.params.id }).then((catchamados) => {
        res.render("admin/edit-cat-chamado", { catchamados: catchamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de pagamento não encontrado!")
        res.redirect("/admin/cat-pagamentos")
    })
})

// Edita status chamado
router.get('/edit-status-chamado/:id', (req, res) => {
    StatusChamado.findOne({ _id: req.params.id }).then((status) => {
        res.render("admin/edit-status-chamado", { status: status })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Status de chamado não encontrado!")
        res.redirect("/admin/status")
    })
})

router.post('/update-reabri-chamado', (req, res) => {
    Chamado.findOne({ _id: req.body.id }).then((chamado) => {
        chamado.status = 1
        chamado.save().then(() => {
            res.render("admin/chamados", { chamado: chamado })
        })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.redirect("/vis-chamadoencerrado")
    })
})

module.exports = router