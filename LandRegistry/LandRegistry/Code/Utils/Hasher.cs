using System;
using System.Security.Cryptography;

namespace LandRegistry.Code.Utils
{
    public sealed class Hasher
    {
        private const int SaltSize = 16;
        private const int HashSize = 20;
        private const int HashIter = 10000;
        private static byte[] _salt;
        private static byte[] _hash;

        public byte[] Salt
        {
            get { return (byte[]) _salt.Clone(); }
        }

        public byte[] Hash
        {
            get { return (byte[]) _hash.Clone(); }
        }

        public void Execute(string password)
        {
            new RNGCryptoServiceProvider().GetBytes(_salt = new byte[SaltSize]);
            _hash = new Rfc2898DeriveBytes(password, _salt, HashIter).GetBytes(HashSize);
        }

        public void Execute(byte[] hashBytes)
        {
            Array.Copy(hashBytes, 0, _salt = new byte[SaltSize], 0, SaltSize);
            Array.Copy(hashBytes, SaltSize, _hash = new byte[HashSize], 0, HashSize);
        }

        public void Execute(byte[] salt, byte[] hash)
        {
            Array.Copy(salt, 0, _salt = new byte[SaltSize], 0, SaltSize);
            Array.Copy(hash, 0, _hash = new byte[HashSize], 0, HashSize);
        }

        public byte[] ToArray()
        {
            var hashBytes = new byte[SaltSize + HashSize];
            Array.Copy(_salt, 0, hashBytes, 0, SaltSize);
            Array.Copy(_hash, 0, hashBytes, SaltSize, HashSize);
            return hashBytes;
        }

        public bool Verify(string password)
        {
            var test = new Rfc2898DeriveBytes(password, _salt, HashIter).GetBytes(HashSize);
            for (var i = 0; i < HashSize; i++)
                if (test[i] != _hash[i])
                    return false;
            return true;
        }
    }
}