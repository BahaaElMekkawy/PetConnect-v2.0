using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PetConnect.BLL.Services.DTO.Doctor;
using PetConnect.BLL.Services.DTO.PetDto;
using PetConnect.BLL.Services.DTOs.Admin;
using PetConnect.BLL.Services.Interfaces;
using PetConnect.DAL.Data.Enums;
using PetConnect.DAL.Data.Models;
using PetConnect.DAL.UnitofWork;

namespace PetConnect.BLL.Services.Classes
{
    public class AdminService : IAdminService
    {
        private readonly IUnitOfWork unitOfWork;

        public AdminService(IUnitOfWork _unitOfWork)
        {
            unitOfWork = _unitOfWork;
        }

        public AdminDashboardDTO GetPendingDoctorsAndPets()
        {
            var pendingDoctors = unitOfWork.DoctorRepository.GetAll()
                .Where(d => !d.IsApproved)
                .Select(d => new DoctorDetailsDTO
                {
                    Id = d.Id,
                    FName = d.FName,
                    LName = d.LName,
                    ImgUrl = d.ImgUrl ?? "/assets/img/default-doctor.jpg",
                    PetSpecialty = d.PetSpecialty.ToString(),
                    Gender = d.Gender.ToString(),
                    PricePerHour = d.PricePerHour,
                    CertificateUrl = d.CertificateUrl,
                    Street = d.Address.Street,
                    City = d.Address.City,
                    PhoneNumber = d.PhoneNumber,
                    IsApproved = d.IsApproved,
                    IsDeleted = d.IsDeleted
                    
                }).ToList();

            var pendingPets = unitOfWork.PetRepository.GetPendingPetsWithBreedAndCategory()
                .Where(p => !p.IsApproved)
                .Select(p => new PetDetailsDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Status = p.Status,
                    IsApproved = p.IsApproved,
                    Ownership = p.Ownership,
                    ImgUrl = "https://localhost:7102/assets/petimages/" + p.ImgUrl,
                    BreadName = p.Breed.Name,
                    CategoryName = p.Breed.Category.Name,
                    IsDeleted = p.IsDeleted
                }).ToList();

            return new AdminDashboardDTO
            {
                PendingDoctors = pendingDoctors,
                PendingPets = pendingPets
            };
        }

        public DoctorDetailsDTO? ApproveDoctor(string id)
        {
            Doctor? doctor = unitOfWork.DoctorRepository.GetByID(id);
            if (doctor is not null)
            {
                doctor.IsApproved = true;
                doctor.IsDeleted = false;
                unitOfWork.DoctorRepository.Update(doctor);
                unitOfWork.SaveChanges();

                DoctorDetailsDTO dto = new DoctorDetailsDTO()
                {
                    Id = doctor.Id,
                    IsApproved = doctor.IsApproved,
                    PetSpecialty = doctor.PetSpecialty.ToString(),
                    FName = doctor.FName,
                    LName = doctor.LName,
                    City = doctor.Address.City,
                    Street = doctor.Address.Street,
                    PricePerHour = doctor.PricePerHour
                };
                return dto;
            }
            return null;
        }

        public PetDetailsDto? ApprovePet(int id)
        {
            Pet? pet = unitOfWork.PetRepository.GetByID(id);
            if (pet is not null)
            {
                pet.IsApproved = true;
                pet.IsDeleted = false;
                unitOfWork.PetRepository.Update(pet);
                unitOfWork.SaveChanges();

                PetDetailsDto dto = new PetDetailsDto()
                {
                    Name = pet.Name,
                    Id = pet.Id,
                    Status = pet.Status,
                    IsApproved = pet.IsApproved
                };
                return dto;
            }
            return null;
        }

        public DoctorDetailsDTO? RejectDoctor(string id, string message)
        {
            var doctor = unitOfWork.DoctorRepository.GetByID(id);
            if (doctor is not null)
            {
                //update doctor
                doctor.IsDeleted = true;
                doctor.IsApproved = false;
                unitOfWork.DoctorRepository.Update(doctor);
                //add the message to the database
                AdminDoctorMessage adminDoctorMessage = new AdminDoctorMessage();
                adminDoctorMessage.MessageType = AdminMessageType.Rejection;
                adminDoctorMessage.Message = message;
                adminDoctorMessage.DoctorId = id;
                unitOfWork.AdminDoctorMessageRepository.Add(adminDoctorMessage);
                unitOfWork.SaveChanges();
                //return the details to show in the API result 
                DoctorDetailsDTO dto = new DoctorDetailsDTO()
                {
                    Id = doctor.Id,
                    IsApproved = doctor.IsApproved,
                    PetSpecialty = doctor.PetSpecialty.ToString(),
                    FName = doctor.FName,
                    LName = doctor.LName,
                    City = doctor.Address.City,
                    Street = doctor.Address.Street,
                    PricePerHour = doctor.PricePerHour,
                    IsDeleted = doctor.IsDeleted
                };
                return dto;

            }
            return null;
        }

        public PetDetailsDto? RejectPet(int id, string message)
        {
            var pet = unitOfWork.PetRepository.GetByID(id);
            if (pet is not null) 
            {
                //udate pet
                pet.IsDeleted = true;
                pet.IsApproved = false;
                unitOfWork.PetRepository.Update(pet);
                //add the message to database
                AdminPetMessage adminPetMessage = new AdminPetMessage();
                adminPetMessage.MessageType = AdminMessageType.Rejection;
                adminPetMessage.PetId = id;
                adminPetMessage.Message = message;
                unitOfWork.AdminPetMessageRepository.Add(adminPetMessage);
                unitOfWork.SaveChanges();
                //return the details to show in the API result 
                PetDetailsDto dto = new PetDetailsDto()
                {
                    Name = pet.Name,
                    Id = pet.Id,
                    Status = pet.Status,
                    IsApproved = pet.IsApproved,
                    IsDeleted = pet.IsDeleted
                };
                return dto;

            }
            return null;
        }
    }
}
