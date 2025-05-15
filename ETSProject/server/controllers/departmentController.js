import Department from "../models/Department.js";
const getDepartments = async (req,res) =>{
  try{
    const departments = await Department.find()
    return res.status(200).json({success:true,departments})
  }catch(error){
    return res.status(500).json({success:false,error:"get department server error"})
  }
}

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;

    // Check if the department already exists
    const existingDepartment = await Department.findOne({ dep_name });
    if (existingDepartment) {
      return res.status(400).json({ success: false, error: "Department already exists" });
    }

    // Create a new department
    const newDep = new Department({
      dep_name,
      description,
    });

    // Save the department to the database
    await newDep.save();

    console.log("Department added:", newDep);  // Log added department for debugging
    return res.status(201).json({ success: true, department: newDep });
  } catch (error) {
    console.error("Error saving department:", error);  // Log error on the server
    return res.status(500).json({ success: false, error: "Add department server error" });
  }
};

// Edit or Update department by id
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;

    // Check if the department exists
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    // Update the department
    department.dep_name = dep_name || department.dep_name;
    department.description = description || department.description;

    // Save the updated department to the database
    await department.save();

    return res.status(200).json({ success: true, department });
  } catch (error) {
    console.error("Error updating department:", error);  // Log error on the server
    return res.status(500).json({ success: false, error: "Edit department server error" });
  }
};


// Backend Controller - getDepartmentById only get one department by id
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    return res.status(200).json({ success: true, department });
  } catch (error) {
    console.error("Error fetching department:", error);
    return res.status(500).json({ success: false, error: "Server error while fetching department" });
  }
};


// Backend Controller - deleteDepartment
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    await Department.deleteOne({ _id: id });

    return res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    return res.status(500).json({ success: false, error: "Server error while deleting department" });
  }
};

export {addDepartment,getDepartments,updateDepartment,getDepartmentById,deleteDepartment};
