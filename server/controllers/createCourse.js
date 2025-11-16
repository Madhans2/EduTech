export const createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Thumbnail is required' });
    }

    // Upload to Cloudinary
    const thumbnailRes = await uploadThumbnail(req.file);

    const course = await Course.create({
      title,
      description,
      instructor: req.user._id,
      thumbnail: thumbnailRes.secure_url,
      category
    });

    res.status(201).json(course);
  } catch (err) {
    console.error('Create course error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};