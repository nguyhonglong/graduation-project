const express = require('express');
const alertService = require('../services/alert.service');

const router = express.Router();

router.post('/alerts', async (req, res) => {
    try {
        const alert = await alertService.createAlert(req.body);
        res.status(201).json(alert);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/alerts', async (req, res) => {
    try {
        const alerts = await alertService.getAlerts();
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/alerts/:id', async (req, res) => {
    try {
        const alert = await alertService.getAlertById(req.params.id);
        if (alert) {
            res.json(alert);
        } else {
            res.status(404).json({ error: 'Alert not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/alerts/:id', async (req, res) => {
    try {
        const alert = await alertService.updateAlert(req.params.id, req.body);
        if (alert) {
            res.json(alert);
        } else {
            res.status(404).json({ error: 'Alert not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/alerts/:id', async (req, res) => {
    try {
        const alert = await alertService.deleteAlert(req.params.id);
        if (alert) {
            res.json({ message: 'Alert deleted' });
        } else {
            res.status(404).json({ error: 'Alert not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 