using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.InteropServices;

namespace CsharpDemo
{
    class InterfaceDef
    {
        public const string DLL_NAME = "VideoSDK.dll";

        [DllImport(DLL_NAME, EntryPoint = "Video_Init", CallingConvention = CallingConvention.Cdecl)]
        public static extern int Video_Init(string szEvn);

        [DllImport(DLL_NAME, EntryPoint = "Video_Fini", CallingConvention = CallingConvention.Cdecl)]
        public static extern int Video_Fini();

        [DllImport(DLL_NAME, EntryPoint = "Video_GetLastError", CallingConvention = CallingConvention.Cdecl)]
        public static extern int Video_GetLastError();

        [DllImport(DLL_NAME, EntryPoint = "Video_StartPreview", CallingConvention = CallingConvention.Cdecl)]
        public static extern long Video_StartPreview(string szUrl, IntPtr phWnd, ref CsharpDemo.StructDef.stPlayReq stPlayReq);

        [DllImport(DLL_NAME, EntryPoint = "Video_StopPreview", CallingConvention = CallingConvention.Cdecl)]
        public static extern int Video_StopPreview(long lPlayHandle);
        
        [DllImport(DLL_NAME, EntryPoint = "Video_StartPlayback", CallingConvention = CallingConvention.Cdecl)]
        public static extern long Video_StartPlayback(string szUrl, IntPtr phWnd, long lStartTimeStamp, long lEndTimeStamp, ref CsharpDemo.StructDef.stPlayReq stPlayReq);

        [DllImport(DLL_NAME, EntryPoint = "Video_StopPlayback", CallingConvention = CallingConvention.Cdecl)]
        public static extern int Video_StopPlayback(long lPlayHandle);

        [DllImport(DLL_NAME, EntryPoint = "Video_PlayCtrl", CallingConvention = CallingConvention.Cdecl)]
        public static extern int Video_PlayCtrl(long lPlayHandle, int iCtrlType, long lParam);

        [DllImport(DLL_NAME, EntryPoint = "Video_SoundCtrl", CallingConvention = CallingConvention.Cdecl)]
        public static extern int Video_SoundCtrl(long lPlayHandle, int iCtrlType);
        
        [DllImport(DLL_NAME, EntryPoint = "Video_GetVolume", CallingConvention = CallingConvention.Cdecl)]
        public static extern int Video_GetVolume(long lPlayHandle);
        
        [DllImport(DLL_NAME, EntryPoint = "Video_SetVolume", CallingConvention = CallingConvention.Cdecl)]
        public static extern int Video_SetVolume(long lPlayHandle, int iVolume);

        [DllImport(DLL_NAME, EntryPoint = "Video_PlaySnap", CallingConvention = CallingConvention.Cdecl)]
        public static extern int Video_PlaySnap(long lPlayHandle, string szAbsoluteFileName);

        [DllImport(DLL_NAME, EntryPoint = "Video_StartDownload", CallingConvention = CallingConvention.Cdecl)]
        public static extern long Video_StartDownload(string szDownloadUrl, string szAbsoluteFileName, ref CsharpDemo.StructDef.stDownloadReq stDownloadReq);

        [DllImport(DLL_NAME, EntryPoint = "Video_StopDownload", CallingConvention = CallingConvention.Cdecl)]
        public static extern int Video_StopDownload(long lDownloadHandle);

        /*
        [DllImport(DLL_NAME, EntryPoint = "Video_PlayCtrl", CallingConvention = CallingConvention.Cdecl)]
        public static extern int Video_PlayCtrl();

        */
    }
}
