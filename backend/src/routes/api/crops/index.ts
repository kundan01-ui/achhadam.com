import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all crops
router.get('/', async (req, res) => {
  try {
    const crops = await prisma.crop.findMany({
      include: {
        farmer: true,
        images: true
      }
    });
    res.json({ success: true, crops });
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get crops by farmer ID
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const crops = await prisma.crop.findMany({
      where: { farmerId },
      include: {
        farmer: true,
        images: true
      }
    });
    res.json({ success: true, crops });
  } catch (error) {
    console.error('Error fetching farmer crops:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Create new crop
router.post('/', async (req, res) => {
  try {
    const {
      name,
      type,
      variety,
      quantity,
      unit,
      quality,
      price,
      harvestDate,
      organic,
      location,
      description,
      farmerId,
      farmerName,
      farmerPhone,
      images = []
    } = req.body;

    // Validate required fields
    if (!name || !type || !price || !farmerId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, type, price, farmerId'
      });
    }

    // Create crop
    const crop = await prisma.crop.create({
      data: {
        name,
        type,
        variety: variety || 'Unknown',
        quantity: quantity || 1,
        unit: unit || 'kg',
        quality: quality || 'good',
        price: parseFloat(price),
        harvestDate: harvestDate || new Date().toISOString(),
        organic: organic || false,
        location: location || 'Unknown',
        description: description || '',
        farmerId,
        farmerName: farmerName || 'Unknown Farmer',
        farmerPhone: farmerPhone || 'unknown',
        status: 'available',
        uploadedAt: new Date().toISOString(),
        images: {
          create: images.map((img: any) => ({
            fileName: img.fileName || 'crop-image.jpg',
            fileSize: img.fileSize || 0,
            fileType: img.fileType || 'image/jpeg',
            imageUrl: img.imageUrl || '',
            metadata: img.metadata || {},
            analysis: img.analysis || {}
          }))
        }
      },
      include: {
        farmer: true,
        images: true
      }
    });

    res.status(201).json({ success: true, crop });
  } catch (error) {
    console.error('Error creating crop:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get crop by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const crop = await prisma.crop.findUnique({
      where: { id },
      include: {
        farmer: true,
        images: true
      }
    });

    if (!crop) {
      return res.status(404).json({ success: false, error: 'Crop not found' });
    }

    res.json({ success: true, crop });
  } catch (error) {
    console.error('Error fetching crop:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update crop
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const crop = await prisma.crop.update({
      where: { id },
      data: updateData,
      include: {
        farmer: true,
        images: true
      }
    });

    res.json({ success: true, crop });
  } catch (error) {
    console.error('Error updating crop:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Delete crop
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.crop.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Error deleting crop:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
























