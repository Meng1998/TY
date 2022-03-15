
// stdafx.h : ��׼ϵͳ�����ļ��İ����ļ���
// ���Ǿ���ʹ�õ��������ĵ�
// �ض�����Ŀ�İ����ļ�

#pragma once

#ifndef VC_EXTRALEAN
#define VC_EXTRALEAN            // �� Windows ͷ���ų�����ʹ�õ�����
#endif

#include "targetver.h"

#define _ATL_CSTRING_EXPLICIT_CONSTRUCTORS      // ĳЩ CString ���캯��������ʽ��

// �ر� MFC ��ĳЩ�����������ɷ��ĺ��Եľ�����Ϣ������
#define _AFX_ALL_WARNINGS

#include <afxwin.h>         // MFC ��������ͱ�׼���
#include <afxext.h>         // MFC ��չ


#include <afxdisp.h>        // MFC �Զ�����



#ifndef _AFX_NO_OLE_SUPPORT
#include <afxdtctl.h>           // MFC �� Internet Explorer 4 �����ؼ���֧��
#endif
#ifndef _AFX_NO_AFXCMN_SUPPORT
#include <afxcmn.h>             // MFC �� Windows �����ؼ���֧��
#endif // _AFX_NO_AFXCMN_SUPPORT

#include <afxcontrolbars.h>     // �������Ϳؼ����� MFC ֧��

#include <string>

#define MSG_UPDATE_TOKEN (WM_USER + 1000)
#define MSG_NOTIFY_EZVIZ_RECORD_QRY_RESULT (WM_USER + 1001)
#define MSG_UPDATE_CALLBACKINFO (WM_USER + 1002)

#define CALLBACK_STREAM 0
#define CALLBACK_MSG 1
#define CALLBACK_YUV 2

#ifdef _UNICODE
#if defined _M_IX86
#pragma comment(linker,"/manifestdependency:\"type='win32' name='Microsoft.Windows.Common-Controls' version='6.0.0.0' processorArchitecture='x86' publicKeyToken='6595b64144ccf1df' language='*'\"")
#elif defined _M_X64
#pragma comment(linker,"/manifestdependency:\"type='win32' name='Microsoft.Windows.Common-Controls' version='6.0.0.0' processorArchitecture='amd64' publicKeyToken='6595b64144ccf1df' language='*'\"")
#else
#pragma comment(linker,"/manifestdependency:\"type='win32' name='Microsoft.Windows.Common-Controls' version='6.0.0.0' processorArchitecture='*' publicKeyToken='6595b64144ccf1df' language='*'\"")
#endif
#endif

// ȥ���ַ�����β��trimFlag�ַ���
inline std::string StringTrim(const std::string& str, const std::string& trimFlag)
{
	if (str.empty() || trimFlag.empty())
	{
		return str;
	}

	std::string szTmp = str;
	std::string::size_type pos = szTmp.find_first_not_of(trimFlag);
	if (pos != std::string::npos)
	{
		szTmp = szTmp.substr(pos, szTmp.length() - pos);
	}

	reverse(szTmp.begin(), szTmp.end());
	pos = szTmp.find_first_not_of(trimFlag);
	if (pos != std::string::npos)
	{
		szTmp = szTmp.substr(pos, szTmp.length() - pos);
	}

	reverse(szTmp.begin(), szTmp.end());
	return szTmp;
}