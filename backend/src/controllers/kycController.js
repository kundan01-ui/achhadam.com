const FarmerKYC = require('../models/FarmerKYC');

// Submit Farmer KYC
exports.submitFarmerKYC = async (req, res) => {
  try {
    const {
      farmerId,
      farmerKYCId,
      panNumber,
      aadharNumber,
      accountHolderName,
      bankAccountNumber,
      ifscCode,
      bankName,
      branchName,
      upiId,
      panCardImage,
      aadharFrontImage,
      aadharBackImage,
      verificationStatus,
      submittedAt
    } = req.body;

    // Check if KYC already exists for this farmer
    let existingKYC = await FarmerKYC.findOne({ farmerId });

    if (existingKYC) {
      // Update existing KYC
      existingKYC.farmerKYCId = farmerKYCId;
      existingKYC.panNumber = panNumber;
      existingKYC.aadharNumber = aadharNumber;
      existingKYC.accountHolderName = accountHolderName;
      existingKYC.bankAccountNumber = bankAccountNumber;
      existingKYC.ifscCode = ifscCode;
      existingKYC.bankName = bankName;
      existingKYC.branchName = branchName;
      existingKYC.upiId = upiId;
      existingKYC.panCardImage = panCardImage;
      existingKYC.aadharFrontImage = aadharFrontImage;
      existingKYC.aadharBackImage = aadharBackImage;
      existingKYC.verificationStatus = verificationStatus || 'pending';
      existingKYC.submittedAt = submittedAt || new Date();

      await existingKYC.save();

      return res.status(200).json({
        success: true,
        message: 'KYC updated successfully',
        data: existingKYC
      });
    }

    // Create new KYC record
    const newKYC = new FarmerKYC({
      farmerId,
      farmerKYCId,
      panNumber,
      aadharNumber,
      accountHolderName,
      bankAccountNumber,
      ifscCode,
      bankName,
      branchName,
      upiId,
      panCardImage,
      aadharFrontImage,
      aadharBackImage,
      verificationStatus: verificationStatus || 'pending',
      submittedAt: submittedAt || new Date()
    });

    await newKYC.save();

    res.status(201).json({
      success: true,
      message: 'KYC submitted successfully',
      data: newKYC
    });

  } catch (error) {
    console.error('Error submitting KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit KYC',
      error: error.message
    });
  }
};

// Get Farmer KYC by Farmer ID
exports.getFarmerKYC = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const kycData = await FarmerKYC.findOne({ farmerId }).populate('farmerId', 'name email phone');

    if (!kycData) {
      return res.status(404).json({
        success: false,
        message: 'KYC data not found'
      });
    }

    res.status(200).json({
      success: true,
      data: kycData
    });

  } catch (error) {
    console.error('Error fetching KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KYC data',
      error: error.message
    });
  }
};

// Get all pending KYC requests (Admin)
exports.getPendingKYC = async (req, res) => {
  try {
    const pendingKYCs = await FarmerKYC.find({ verificationStatus: 'pending' })
      .populate('farmerId', 'name email phone')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingKYCs.length,
      data: pendingKYCs
    });

  } catch (error) {
    console.error('Error fetching pending KYCs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending KYCs',
      error: error.message
    });
  }
};

// Verify/Reject KYC (Admin)
exports.updateKYCStatus = async (req, res) => {
  try {
    const { kycId } = req.params;
    const { verificationStatus, rejectionReason, adminNotes, verifiedBy } = req.body;

    const kycData = await FarmerKYC.findById(kycId);

    if (!kycData) {
      return res.status(404).json({
        success: false,
        message: 'KYC data not found'
      });
    }

    kycData.verificationStatus = verificationStatus;
    kycData.rejectionReason = rejectionReason;
    kycData.adminNotes = adminNotes;

    if (verificationStatus === 'verified') {
      kycData.verifiedBy = verifiedBy;
      kycData.verifiedAt = new Date();
    }

    await kycData.save();

    res.status(200).json({
      success: true,
      message: `KYC ${verificationStatus} successfully`,
      data: kycData
    });

  } catch (error) {
    console.error('Error updating KYC status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update KYC status',
      error: error.message
    });
  }
};

// Delete KYC (Admin only - for testing/cleanup)
exports.deleteKYC = async (req, res) => {
  try {
    const { kycId } = req.params;

    const kycData = await FarmerKYC.findByIdAndDelete(kycId);

    if (!kycData) {
      return res.status(404).json({
        success: false,
        message: 'KYC data not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'KYC deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete KYC',
      error: error.message
    });
  }
};
