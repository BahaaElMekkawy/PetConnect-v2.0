﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace PetConnect.DAL.Data.GenericRepository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly AppDbContext context;

        public GenericRepository(AppDbContext _context)
        {
            context = _context;
        }
        public void Add(T entity)
        {
            context.Set<T>().Add(entity);
        }
        public void Delete(T entity)
        {
            context.Set<T>().Remove(entity);
           
        }
        public IEnumerable<T> GetAll(bool withracking = false)
        {
            if (withracking)
                return context.Set<T>().ToList();
            else
               return context.Set<T>().AsNoTracking().ToList();     

        }

        public T? GetByID(int id)
        {
            return context.Set<T>().Find(id);
        }
        public T? GetByID(string id)
        {
            return context.Set<T>().Find(id);
        }

        public void Update(T entity)
        {
            context.Set<T>().Update(entity);
        }
    }
}
