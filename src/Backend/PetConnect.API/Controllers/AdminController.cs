using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PetConnect.BLL.Services.DTOs;
using PetConnect.BLL.Services.Interfaces;

namespace PetConnect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService adminService;
        public AdminController(IAdminService _adminService)
        {
            adminService = _adminService;
        }



        [HttpGet]
        public IActionResult Index()
        {
            var dashboard = adminService.GetPendingDoctorsAndPets();
            return Ok(new GeneralResponse(200, dashboard));
        }




        [HttpPost("approve-doctor/{id}")]
        public IActionResult ApproveDoctor(string id)
        {
            var result = adminService.ApproveDoctor(id);
            if (result == null)
                return BadRequest();
            else 
            {
                return Ok(new GeneralResponse(200, result));
            }
        }





        [HttpPost("approve-pet/{id}")]
        public IActionResult ApprovePet(int id)
        {
            var result = adminService.ApprovePet(id);
            if (result == null)
                return BadRequest();
            else
            {
                return Ok(new GeneralResponse(200, result));
            }
        }
    }
}
