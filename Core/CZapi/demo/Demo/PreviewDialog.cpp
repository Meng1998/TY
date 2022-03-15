// PreviewDialogEx.cpp : ʵ���ļ�
//

#include "stdafx.h"
#include "Demo.h"
#include "PreviewDialog.h"
#include "afxdialogex.h"


// CPreviewDialogEx �Ի���

IMPLEMENT_DYNAMIC(CPreviewDialog, CDialog)

CPreviewDialog::CPreviewDialog(CWnd* pParent /*=NULL*/)
	: CDialog(IDD_DIALOG_PREVIEW, pParent)
	, _url(_T(""))
	, _snapPicAbsoluteFileName(_T(""))
	, _volume(0)
	, _osdText(_T(""))
	, _localRecordAbsoluteFileName(_T(""))
	, _localRecordType(0)
	, _osdStartX(0)
	, _osdStartY(0)
	, _osdFontSize(0)
	, _osdColorR(0)
	, _osdColorG(0)
	, _osdColorB(0)
	, _osdAlignType(0)
	, _osdBold(0)
	, _streamInfo(_T(""))
	, _yuvInfo(_T(""))
	, _volumeToSet(0)
	, _packageSize(1024 * 1024 * 500)
	, _privateMainType(0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020)
	, _privateSubType(0)
{

}

CPreviewDialog::~CPreviewDialog()
{
}

void CPreviewDialog::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_STATIC_PREVIEW, _playWnd);
	DDX_Control(pDX, IDC_LIST_PREVIEW, _msgList);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_URL, _url);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_SNAL_FILE, _snapPicAbsoluteFileName);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_VOLUME, _volume);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_TEXT, _osdText);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_LOCAL_FILE, _localRecordAbsoluteFileName);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_LOCALRECORD_TYPE, _localRecordType);
	DDX_Control(pDX, IDC_COMBO_PREVIEW_OSD_ID, _osdIdComboBox);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_X, _osdStartX);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_Y, _osdStartY);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_FONTSIZE, _osdFontSize);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_R, _osdColorR);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_G, _osdColorG);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_B, _osdColorB);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_ALIGN, _osdAlignType);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_OSD_BOLD, _osdBold);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_STREAM, _streamInfo);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_YUV, _yuvInfo);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_VOLUME_SETVALUE, _volumeToSet);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_PACKAGESIZE, _packageSize);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_MAINTYPE, _privateMainType);
	DDX_Text(pDX, IDC_EDIT_PREVIEW_SUBTYPE, _privateSubType);
}

BEGIN_MESSAGE_MAP(CPreviewDialog, CDialog)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_PLAY, &CPreviewDialog::OnBnClickedButtonPreviewPlay)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_STOP, &CPreviewDialog::OnBnClickedButtonPreviewStop)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_SNAP, &CPreviewDialog::OnBnClickedButtonPreviewSnap)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_OPENSOUND, &CPreviewDialog::OnBnClickedButtonPreviewOpensound)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_CLOSESOUND, &CPreviewDialog::OnBnClickedButtonPreviewClosesound)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_VIDEO_DETAIL, &CPreviewDialog::OnBnClickedButtonPreviewVideoDetail)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_GETVOLUME, &CPreviewDialog::OnBnClickedButtonPreviewGetvolume)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_SETVOLUME, &CPreviewDialog::OnBnClickedButtonPreviewSetvolume)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_SETOSD, &CPreviewDialog::OnBnClickedButtonPreviewSetosd)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_START_LOCALRECORD, &CPreviewDialog::OnBnClickedButtonPreviewStartLocalrecord)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_STOP_LOCALRECORD, &CPreviewDialog::OnBnClickedButtonPreviewStopLocalrecord)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_CHANGLE_STREAMTYPE, &CPreviewDialog::OnBnClickedButtonPreviewChangleStreamtype)
	ON_LBN_DBLCLK(IDC_LIST_PREVIEW, &CPreviewDialog::OnLbnDblclkListPlaybackMsgbox)
	ON_MESSAGE(MSG_UPDATE_CALLBACKINFO, &CPreviewDialog::OnUpdateCallbackInfo)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_PRIVATE_OPEN, &CPreviewDialog::OnBnClickedButtonPreviewPrivateOpen)
	ON_BN_CLICKED(IDC_BUTTON_PREVIEW_PRIVATE_CLOSE, &CPreviewDialog::OnBnClickedButtonPreviewPrivateClose)
END_MESSAGE_MAP()


// CPreviewDialogEx ��Ϣ�������


void CPreviewDialog::OnBnClickedButtonPreviewPlay()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	if (_playHandle > -1)
	{
		_printMsg("��ǰ���ڲ��š�ȡ�����ȡYUV״̬������ֹͣ");
		return;
	}
	
	CString str;
	GetDlgItemText(IDC_EDIT_PREVIEW_URL, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"Ԥ��ȡ��URL����Ϊ��");
		return;
	}

	SetDlgItemText(IDC_EDIT_PREVIEW_STREAM, L"");
	SetDlgItemText(IDC_EDIT_PREVIEW_YUV, L"");

	UpdateData(TRUE);

	bool isUseGpuDecode = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_GPU))->GetCheck();
	bool isAsyn = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISASYN))->GetCheck();
	bool isUseWnd = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISUSEHWND))->GetCheck();
	bool isCbStream = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISUSESTREAM))->GetCheck();
	bool isCbYUV = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISUSEYUV))->GetCheck();
	bool isCbMsg = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_ISUSEMSG))->GetCheck();
	HWND hWnd = isUseWnd ? _playWnd.GetSafeHwnd() : nullptr;

	VIDEO_PLAY_REQ req = { 0 };
	req.pUserData = this;
	req.iHardWareDecode = isUseGpuDecode ? 1 : 0;
	req.fnDecodedStream = isCbYUV ? &CPreviewDialog::cb_decodedDataCallback : nullptr;
	req.fnMsg = isCbMsg ? &CPreviewDialog::cb_msgCallback : nullptr;
	req.fnStream = isCbStream ? &CPreviewDialog::cb_streamCallback : nullptr;

	USES_CONVERSION;
	std::string url = T2A(str);
	url = StringTrim(url, " ");
	ULONGLONG costs = GetTickCount64();
	_playHandle = isAsyn ? Video_StartAsynPreview(url.c_str(), hWnd, &req) : Video_StartPreview(url.c_str(), hWnd, &req);
	costs = GetTickCount64() - costs;
	_printMsg(isAsyn ? "Video_StartAsynPreview���첽Ԥ����" : "Video_StartPreview��ͬ��Ԥ����", _playHandle != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);
}

void CPreviewDialog::OnBnClickedButtonPreviewStop()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	int ret = Video_StopPreview(_playHandle);
	costs = GetTickCount64() - costs;
	_playHandle = -1;
	_printMsg("Video_StopPreview��ֹͣԤ����",ret, Video_GetLastError(), costs);

	// ˢ���´���
	_playWnd.ShowWindow(SW_HIDE);
	_playWnd.ShowWindow(SW_SHOW);

	SetDlgItemText(IDC_EDIT_PREVIEW_STREAM, L"");
	SetDlgItemText(IDC_EDIT_PREVIEW_YUV, L"");

	_osdIdComboBox.ResetContent();
	_osdIdComboBox.InsertString(0, L"0");
	_osdIdComboBox.SetItemData(0, static_cast<DWORD_PTR>(0));
	_osdIdComboBox.SetCurSel(0);
}


void CPreviewDialog::OnBnClickedButtonPreviewSnap()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString str;
	GetDlgItemText(IDC_EDIT_PREVIEW_SNAL_FILE, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"ץͼ���Ʋ���Ϊ��");
		return;
	}

	bool isBmp = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISBMP))->GetCheck();
	str = str + CString(isBmp ? ".bmp" : ".jpg");

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	int ret = Video_PlaySnap(_playHandle, T2A(str));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PlaySnap��Ԥ��ץͼ��", ret, Video_GetLastError(), costs);
}


void CPreviewDialog::OnBnClickedButtonPreviewOpensound()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	int ret = Video_SoundCtrl(_playHandle, 0);
	costs = GetTickCount64() - costs;
	_printMsg("Video_SoundCtrl����������", ret, Video_GetLastError(), costs);
}


void CPreviewDialog::OnBnClickedButtonPreviewClosesound()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	int ret = Video_SoundCtrl(_playHandle, 1);
	costs = GetTickCount64() - costs;
	_printMsg("Video_SoundCtrl���ر�������", ret, Video_GetLastError(), costs);
}


void CPreviewDialog::OnBnClickedButtonPreviewVideoDetail()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	auto systemTypeTransfunc = [](int systemType) {
		std::string str;
		switch (systemType)
		{
		case 4:
			str = "raw";
			break;
		case 1:
			str = "ps";
			break;
		case 3:
			str = "rtp";
			break;
		case 2:
			str = "ts";
			break;
		case 5:
			str = "rtp+ps";
			break;
		default:
			break;
		}

		return str;
	};

	auto encodeTypeTransfunc = [](int encodeType) {
		std::string str;
		switch (encodeType)
		{
		case 6:
			str = "raw";
			break;
		case 1:
			str = "H.264";
			break;
		case 2:
			str = "ps";
			break;
		case 3:
			str = "mp4";
			break;
		case 4:
			str = "H.265";
			break;
		case 5:
			str = "gb";
			break;
		default:
			break;
		}

		return str;
	};

	VIDEO_DETAIL_INFO info = { 0 };
	char buffer[512] = { 0 };
	ULONGLONG costs = GetTickCount64();
	int ret = Video_GetVideoInfo(_playHandle, &info);
	costs = GetTickCount64() - costs;
	if (VIDEO_ERR_SUCCESS == ret)
	{
		sprintf_s(buffer, "��ȡ��Ƶ���飺���=%d���߶�=%d��֡��=%I64d������=%f����������=%s����װ����=%s��", info.iWidth, info.iHeight, info.i64FrameRate, info.fCodeRate, encodeTypeTransfunc(info.iEncodeType).c_str(), systemTypeTransfunc(info.iEncapsulationType).c_str());
	}
	
	std::string str = std::string("Video_GetVideoInfo��") + (VIDEO_ERR_SUCCESS == ret ? buffer : "��ȡ��Ƶ���飩");
	_printMsg(str, ret, Video_GetLastError(), costs);
}


void CPreviewDialog::OnBnClickedButtonPreviewGetvolume()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	int ret = Video_GetVolume(_playHandle);
	costs = GetTickCount64() - costs;
	_printMsg("Video_GetVolume����ȡ������", ret != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);

	if (ret != VIDEO_ERR_FAIL)
	{
		CString str;
		str.Format(L"%d", ret);
		SetDlgItemText(IDC_EDIT_PREVIEW_VOLUME, str);
	}
}

void CPreviewDialog::OnBnClickedButtonPreviewSetvolume()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString str;
	GetDlgItemText(IDC_EDIT_PREVIEW_VOLUME_SETVALUE, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"����������ֵ����Ϊ��");
		return;
	}

	USES_CONVERSION;	
	ULONGLONG costs = GetTickCount64();
	int ret = Video_SetVolume(_playHandle, atoi(T2A(str)));
	costs = GetTickCount64() - costs;
	_printMsg("Video_SetVolume������������", ret, Video_GetLastError(), costs);
}


void CPreviewDialog::OnBnClickedButtonPreviewSetosd()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString strR;
	CString strG;
	CString strB;
	CString strIsBold;
	CString strFontSize;
	CString strX;
	CString strY;
	CString strAlignType;
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_R, strR);
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_G, strG);
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_B, strB);
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_BOLD, strIsBold);
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_FONTSIZE, strFontSize);
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_X, strX);
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_Y, strY); 
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_ALIGN, strAlignType);
	if (strR.IsEmpty() || strG.IsEmpty() || strB.IsEmpty() || strIsBold.IsEmpty() || strFontSize.IsEmpty() || strX.IsEmpty() || strY.IsEmpty() || strAlignType.IsEmpty())
	{
		AfxMessageBox(L"�ַ����Ӳ�������Ϊ��");
		return;
	}

	CString strText;
	GetDlgItemText(IDC_EDIT_PREVIEW_OSD_TEXT, strText);

	int index = _osdIdComboBox.GetCurSel();
	int osdId = (int)_osdIdComboBox.GetItemData(index);
	VIDEO_OSD_INFO info = { 0 };
	USES_CONVERSION;
	info.ix = atoi(T2A(strX));
	info.iy = atoi(T2A(strY));
	info.iAlignType = atoi(T2A(strAlignType));
	int r = atoi(T2A(strR));
	int g = atoi(T2A(strG));
	int b = atoi(T2A(strB));
	info.i64Color = RGB(r > 255 ? 255 : (r < 0 ? 0 : r), g > 255 ? 255 : (g < 0 ? 0 : g), b > 255 ? 255 : (b < 0 ? 0 : b));
	info.iFontSize = atoi(T2A(strFontSize));
	info.iBold = atoi(T2A(strIsBold));

	
	ULONGLONG costs = GetTickCount64();
	int ret = Video_SetOSDText(_playHandle, osdId, T2A(strText), &info);
	costs = GetTickCount64() - costs;
	_printMsg("Video_SetOSDText���ַ����ӣ�", ret > 0 ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);

	if (ret > 0)
	{
		// �״ε���
		if (osdId < 1)
		{
			CString str;
			str.Format(L"%d", ret);
			_osdIdComboBox.InsertString(ret, str);  // iId ��1��ʼ
			_osdIdComboBox.SetItemData(ret, static_cast<DWORD_PTR>(ret));
			_osdIdComboBox.SetCurSel(ret);
			return;
		}

		// ɾ������
		if (strText.IsEmpty())
		{
			_osdIdComboBox.DeleteString(index);
			_osdIdComboBox.SetCurSel(0);
		}
	}
}

void CPreviewDialog::OnBnClickedButtonPreviewStartLocalrecord()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString strFile;
	GetDlgItemText(IDC_EDIT_PREVIEW_LOCAL_FILE, strFile);
	if (strFile.IsEmpty())
	{
		AfxMessageBox(L"����¼���ļ����Ʋ���Ϊ��");
		return;
	}

	CString strType;
	GetDlgItemText(IDC_EDIT_PREVIEW_LOCALRECORD_TYPE, strType);
	if (strType.IsEmpty())
	{
		AfxMessageBox(L"����¼�����Ͳ���Ϊ��");
		return;
	}

	CString strPackageSize;
	GetDlgItemText(IDC_EDIT_PREVIEW_PACKAGESIZE, strPackageSize);
	if (strPackageSize.IsEmpty())
	{
		AfxMessageBox(L"����¼��ְ���С����Ϊ��");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	std::string szAPackageSize = T2A(strPackageSize);
	std::string szAType = T2A(strType);
	int ret = Video_StartLocalRecord(_playHandle, T2A(strFile), atoi(szAPackageSize.c_str()), atoi(szAType.c_str()));
	costs = GetTickCount64() - costs;
	_printMsg("Video_StartLocalRecord����ʼ����¼��", ret, Video_GetLastError(), costs);
}

void CPreviewDialog::OnBnClickedButtonPreviewStopLocalrecord()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costs = GetTickCount64();
	int ret = Video_StopLocalRecord(_playHandle);
	costs = GetTickCount64() - costs;
	_printMsg("Video_StopLocalRecord��ֹͣ����¼��", ret > VIDEO_ERR_SUCCESS ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costs);
}

void CPreviewDialog::OnBnClickedButtonPreviewChangleStreamtype()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString url;
	GetDlgItemText(IDC_EDIT_PREVIEW_URL, url);
	if (url.IsEmpty())
	{
		AfxMessageBox(L"Ԥ��ȡ��URL����Ϊ��");
		return;
	}

	bool isAsyn = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISASYN))->GetCheck();
	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	int ret = Video_ChangeStreamType(_playHandle, isAsyn ? 1 : 0, T2A(url));
	costs = GetTickCount64() - costs;
	_printMsg("Video_ChangeStreamType���л�����������", ret, Video_GetLastError(), costs);
}

void CPreviewDialog::OnBnClickedButtonPreviewPrivateOpen()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString strMainType;
	GetDlgItemText(IDC_EDIT_PREVIEW_MAINTYPE, strMainType);
	if (strMainType.IsEmpty())
	{
		AfxMessageBox(L"˽�����������Ͳ���Ϊ��");
		return;
	}

	CString strSubType;
	GetDlgItemText(IDC_EDIT_PREVIEW_SUBTYPE, strSubType);
	if (strSubType.IsEmpty())
	{
		AfxMessageBox(L"˽�����������Ͳ���Ϊ��");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();	
	std::string szAMainType = T2A(strMainType);
	std::string szASubType = T2A(strSubType);
	int ret = Video_PrivateDataCtrl(_playHandle, atoi(szAMainType.c_str()), 0, atoi(szASubType.c_str()));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PrivateDataCtrl��˽��������ʾ��", ret, Video_GetLastError(), costs);
}

void CPreviewDialog::OnBnClickedButtonPreviewPrivateClose()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString strMainType;
	GetDlgItemText(IDC_EDIT_PREVIEW_MAINTYPE, strMainType);
	if (strMainType.IsEmpty())
	{
		AfxMessageBox(L"˽�����������Ͳ���Ϊ��");
		return;
	}

	CString strSubType;
	GetDlgItemText(IDC_EDIT_PREVIEW_SUBTYPE, strSubType);
	if (strSubType.IsEmpty())
	{
		AfxMessageBox(L"˽�����������Ͳ���Ϊ��");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	std::string szAMainType = T2A(strMainType);
	std::string szASubType = T2A(strSubType);
	int ret = Video_PrivateDataCtrl(_playHandle, atoi(szAMainType.c_str()), 1, atoi(szASubType.c_str()));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PrivateDataCtrl��˽���������أ�", ret, Video_GetLastError(), costs);
}

void CPreviewDialog::NotifyDialogInited(const char* exeFolder)
{
	_exefold = nullptr == exeFolder ? "" : exeFolder;
	EnableToolTips(TRUE);
	_toolTip.Create(this);
	_toolTip.SetMaxTipWidth(500);
	_toolTip.SetDelayTime(TTDT_AUTOPOP, 32000);
	_toolTip.Activate(TRUE);
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_PREVIEW_GPU), L"�Ƿ�����GPUӲ�⣬��ѡ���ã��������ã�ע�⿪��Ӳ����޷��ص�YUV���ݣ�Ӳ���²�����ʹ��ץͼ����");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_PREVIEW_ISASYN), L"�Ƿ������첽ģʽ�����ú�ʹ���첽Ԥ���ӿ�Ԥ��");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_PREVIEW_ISUSEHWND), L"�Ƿ���ʾ���棬��ѡ��ʾ��������ʾ");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_PREVIEW_ISUSEYUV), L"�Ƿ�ص�YUV���ݣ���ѡ�ص������򲻻ص���ע�⿪��Ӳ����޷��ص�YUV����");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_PREVIEW_ISUSESTREAM), L"�Ƿ�ص��������ݣ���ѡ�ص������򲻻ص�");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_ISUSEMSG), L"�Ƿ�ص���Ϣ����ѡ�ص������򲻻ص�");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_URL), L"������Ԥ��URL��ÿ��Ԥ��ǰ�����²�ѯURL"); 
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_PLAY), L"����ͬ�����첽Ԥ����Video_StartPreview/Video_StartAsynPreview��ȡ����ȡYUV��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_STOP), L"ֹͣԤ����Video_StopPreview��ȡ����ȡYUV��");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_PREVIEW_ISBMP), L"ʹ��ץBMPλͼ����ѡ��ץλͼ������ץJPGͼƬ");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_SNAP), L"����ץͼ��Video_Snap��ֻ�д����ϳ��ֳ�����ʱ����ץͼ��Ҳ���յ����ſ�ʼ��Ϣ�����ʹ�ã�");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_SNAL_FILE), L"����·���ļ����ƣ���������׺");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_OPENSOUND), L"��������Video_SoundCtrl��ֻ���ڴ����ϳ��ֳ�����ʱ���ܴ�������Ҳ���յ����ſ�ʼ��Ϣ�����ʹ�ã�");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_CLOSESOUND), L"�ر�������Video_SoundCtrl��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_VIDEO_DETAIL), L"��ȡ��Ƶ���飨Video_GetVideoInfo�������ֱ��ʡ�������֡�ʡ��������͡���װ���ͣ�ֻ���ڴ����ϳ��ֳ�����ʱ���ܻ�ȡ��Ƶ���飬Ҳ���յ����ſ�ʼ��Ϣ�����ʹ�ã�");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_GETVOLUME), L"��ȡ������Video_GetVolume��ֻ�д����������ʹ�ã���ΧΪ[0 100]��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_SETVOLUME), L"����������Video_SetVolume��ֻ�д����������ʹ�ã���ΧΪ[0 100]��������ΧSDK�ڲ���ʹ�ñ߽�ֵ��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_VOLUME), L"����ֵ����ȡ�������ڴ���ʾ");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_VOLUME_SETVALUE), L"����ֵ����ΧΪ[0 100]��������Χʹ�ñ߽�ֵ");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_X), L"�������ַ��������ĺ�����");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_Y), L"�������ַ���������������"); 
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_FONTSIZE), L"�������ַ������ֺŴ�С��Ĭ��ֵ0��ʾ�ֺ�12��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_BOLD), L"�����Ƿ�Ӵ֣�1-�Ӵ� 0-�ǼӴ� ����ֵ-��������");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_R), L"�������ַ�����������ɫR������ȡֵ��Χ[0 255]��������ʹ�ñ߽�ֵ��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_G), L"�������ַ�����������ɫG������ȡֵ��Χ[0 255]��������ʹ�ñ߽�ֵ��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_B), L"�������ַ�����������ɫB������ȡֵ��Χ[0 255]��������ʹ�ñ߽�ֵ��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_ALIGN), L"�����ַ�������ʱ���еĶ��뷽ʽ��0-������� 1-���ж��� 2-���Ҷ��룩");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_OSD_TEXT), L"������������ַ�����֧�ֻ���");
	_toolTip.AddTool(GetDlgItem(IDC_COMBO_PREVIEW_OSD_ID), L"��ѡ�����ID����������ѡ��0���޸Ļ�ɾ��ѡ�����0��ֵ��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_SETOSD), L"�����ַ����ӣ�Video_SetOSDText��id��0��ʾ�������ӣ��������Ӻ󷵻ش���0�ĵ���id���޸ĵ���ʱѡ���Ӧ��id���޸ĵ��ӵ��ַ����Ȳ�����ɾ������ʱѡ���Ӧ��id���޸��ַ���Ϊ���ַ������ɣ�����������������");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_LOCALRECORD_TYPE), L"����¼�����ͣ�0-��ͨ����¼�񣨲�ת��װ��ֱ���������ļ���¼���ļ���Ҫʹ��ר�ò��������ţ���SDK�����豸���ص�¼����ʹ�ô󻪲��������ţ�����SDK��EHOME/ISUP��ONVIF��GB28181Э������豸ʹ�ú������������ţ� 1-ת��װ����ֻҪ��Ƶ����Ƶ��֧���򷵻�ʧ�ܣ�������Ϊ��֧�� 2-ת��װ���������Ƶ����Ƶ��֧���򰴲�ת��װ���� 3-ת��װ���������Ƶ��֧����Ƶ֧����ֻת��Ƶ���������֧���򷵻�ʧ�ܣ�������Ϊ��֧�֣�һ����˵������SDK��EHOME/ISUP��ONVIFЭ������豸����Ƶ��֧��ת��װ�ģ�GB28181����SDKЭ������豸����Ƶ�ǲ�֧��ת��װ��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_LOCAL_FILE), L"����¼��ľ���·��¼���ļ����ƣ��������mp4��׺"); 
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_PACKAGESIZE), L"����¼��ְ���С��ָ�ﵽһ����С����������һ���ļ����������ݣ�����λΪ�ֽڣ�ʵ���ļ��Ĵ�С��һ����ָ���Ĵ�С��ȣ����ܴ�һ��Ҳ����Сһ�㣬������������DemoĬ��500MB");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_START_LOCALRECORD), L"��������¼��Video_StartLocalRecord��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_STOP_LOCALRECORD), L"ֹͣ����¼��Video_StopLocalRecord��");	
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_CHANGLE_STREAMTYPE), L"�л�����������Video_ChangleStreamType��������Ԥ���ɹ������ʹ�ã������ͬ��ģʽ���ӿڷ���ֵ�����л������������첽ģʽ���л��ɹ�����ص���Ϣ���л�ʧ�ܻ�ص��첽����ȡ��ʧ����Ϣ����Ϣ��Ϊ51��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_PRIVATE_OPEN), L"��ʾ˽�����ݣ�Video_PrivateDataCtrl����Ժ����豸����Щ�豸�����Ժ���SDK��EHOME/ISUP��ONVIF��GB28181Э����룻����û�������͵�˽�����ݣ���������֮�����ʹ�á�|����ʵ�ֵ�һ�νӿڿ��ƶ�����ͣ��������������͵ģ������������һ��һ�������ƣ����������͵ĸ��������Ϳ���ʹ�á�|��ʵ�ֵ�һ�νӿڿ���ͬһ�����͵Ķ�������ͣ�");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_PREVIEW_PRIVATE_CLOSE), L"����˽�����ݣ�Video_PrivateDataCtrl����Ժ����豸����Щ�豸�����Ժ���SDK��EHOME/ISUP��ONVIF��GB28181Э����룻����û�������͵�˽�����ݣ���������֮�����ʹ�á�|����ʵ�ֵ�һ�νӿڿ��ƶ�����ͣ��������������͵ģ������������һ��һ�������ƣ����������͵ĸ��������Ϳ���ʹ�á�|��ʵ�ֵ�һ�νӿڿ���ͬһ�����͵Ķ�������ͣ�");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_MAINTYPE), L"˽�����������ͣ�0x0001-���ܷ��� 0x0002-�ƶ���� 0x0004-POS��Ϣ����� 0x0008-ͼƬ���� 0x0010-�ȳ�����Ϣ 0x0020-�¶���Ϣ��ʮ���������Ϳ�ѡ��ΧΪ1~63��������0x0010���ȳ�����Ϣ���������Ͷ���Ϊ0x0001-������ʾ 0x0002-����¶� 0x0004-����¶�λ�� 0x0008-����¶Ⱦ��루ʮ���������Ϳ�ѡ��ΧΪ1~15��������0x0020���¶���Ϣ���������Ͷ���Ϊ0x0001-����� 0x0002-�߲��� 0x0004-����£�ʮ���������Ϳ�ѡ��ΧΪ1~7��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_PREVIEW_SUBTYPE), L"˽�����������ͣ�����0x0010���ȳ�����Ϣ���������Ͷ���Ϊ0x0001-������ʾ 0x0002-����¶� 0x0004-����¶�λ�� 0x0008-����¶Ⱦ��루ʮ���������Ϳ�ѡ��ΧΪ1~15��������0x0020���¶���Ϣ���������Ͷ���Ϊ0x0001-����� 0x0002-�߲��� 0x0004-����£�ʮ���������Ϳ�ѡ��ΧΪ1~7��");
	_initData();
}

BOOL CPreviewDialog::PreTranslateMessage(MSG* pMsg)
{
	if (WM_MOUSEMOVE == pMsg->message || WM_LBUTTONDOWN == pMsg->message || WM_LBUTTONUP == pMsg->message)
	{
		_toolTip.RelayEvent(pMsg);
	}

	return CDialog::PreTranslateMessage(pMsg);
}

LRESULT CPreviewDialog::OnUpdateCallbackInfo(WPARAM wparam, LPARAM lparam)
{
	std::string* str = reinterpret_cast<std::string*>(lparam);
	if (str != nullptr)
	{
		switch (wparam)
		{
		case CALLBACK_MSG:
		{
			USES_CONVERSION;
			_printMsg(*str);
		}
			break;
		case CALLBACK_STREAM:
		{
			USES_CONVERSION;
			_streamInfo = A2T((*str).c_str());
			SetDlgItemText(IDC_EDIT_PREVIEW_STREAM, _streamInfo);
		}
			break;
		case CALLBACK_YUV:
		{
			USES_CONVERSION;
			_yuvInfo = A2T((*str).c_str());
			SetDlgItemText(IDC_EDIT_PREVIEW_YUV, _yuvInfo);
		}
			break;
		default:
			break;
		}

		delete str;
	}

	return 0;
}

void CPreviewDialog::cb_msgCallback(VIDEO_INT64 i64PlayHandle, int iMsg, void * pUserData)
{
	CPreviewDialog* pThis = reinterpret_cast<CPreviewDialog*>(pUserData);
	if (nullptr == pThis)
	{
		return;
	}

	auto msgTransFunc = [](int msgType) {
		std::string str;
		switch (msgType)
		{
		case 1:
			str = "���ſ�ʼ";
			break;
		case 2:
			str = "���Ž���";
			break;
		case 3:
			str = "�����쳣";
			break;
		case 10:
			str = "ȡ����ʼ";
			break;
		case 11:
			str = "ȡ������";
			break;
		case 12:
			str = "ȡ���쳣";
			break;
		case 30:
			str = "��ʱ�طŲ��ſ�ʼ";
			break;
		case 31:
			str = "��ʱ�طŲ��Ž���";
			break;
		case 50:
			str = "�첽����ȡ���ɹ�";
			break;
		case 51:
			str = "�첽����ȡ��ʧ��";
			break;
		default:
			str = "δ֪";
			break;
		}

		return str;
	};

	std::string* str = new (std::nothrow) std::string();
	if (str != nullptr)
	{
		*str = "��Ϣ���ͣ�" + msgTransFunc(iMsg);

		pThis->PostMessage(MSG_UPDATE_CALLBACKINFO, CALLBACK_MSG, reinterpret_cast<LPARAM>(str));
	}
}

void CPreviewDialog::cb_streamCallback(VIDEO_INT64 i64PlayHandle, int iStreamDataType, const char * pDataArray, int iDataLen, void * pUserData)
{
	CPreviewDialog* pThis = reinterpret_cast<CPreviewDialog*>(pUserData);
	if (nullptr == pThis)
	{
		return;
	}

	time_t tmp = time(nullptr);
	if (abs(tmp - pThis->_time4Stream) > 1)
	{
		pThis->_time4Stream = tmp;

		char buffer[1024] = { 0 };
		sprintf_s(buffer, "�����ͣ�%s�������ȣ�%d", 0 == iStreamDataType ? "��ͷ" : (1 == iStreamDataType ? "������" : 2 == iStreamDataType ? "�������" : "δ֪"), iDataLen);
		std::string* str = new (std::nothrow) std::string();
		if (str != nullptr)
		{
			*str = buffer;
			pThis->PostMessage(MSG_UPDATE_CALLBACKINFO, CALLBACK_STREAM, reinterpret_cast<LPARAM>(str));
		}
	}
}

void __stdcall CPreviewDialog::cb_decodedDataCallback(VIDEO_INT64 i64PlayHandle, const char* pDataArray, int iDataLen, int iWidth, int iHeight, int iFrameType, int iTimeStamp, void* pUserData)
{
	CPreviewDialog* pThis = reinterpret_cast<CPreviewDialog*>(pUserData);
	if (nullptr == pThis)
	{
		return;
	}

	time_t tmp = time(nullptr);
	if (abs(tmp - pThis->_time4Yuv) > 1)
	{
		pThis->_time4Yuv = tmp;

		char buffer[1024] = { 0 };
		sprintf_s(buffer, "YUV���ͣ�YV12�������ȣ�%d����ȣ�%d���߶ȣ�%d", iDataLen, iWidth, iHeight);
		std::string* str = new (std::nothrow) std::string();
		if (str != nullptr)
		{
			*str = buffer;
			pThis->PostMessage(MSG_UPDATE_CALLBACKINFO, CALLBACK_YUV, reinterpret_cast<LPARAM>(str));
		}
	}
}

void CPreviewDialog::_initData()
{
	// ��Ҫ����һЩ�ؼ�
	((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISUSEHWND))->SetCheck(BST_CHECKED);
	((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISUSESTREAM))->SetCheck(BST_CHECKED); 
	((CButton*)GetDlgItem(IDC_CHECK_PREVIEW_ISUSEYUV))->SetCheck(BST_CHECKED);
	((CButton*)GetDlgItem(IDC_CHECK_ISUSEMSG))->SetCheck(BST_CHECKED);

	USES_CONVERSION;
	_snapPicAbsoluteFileName = A2T(std::string(_exefold + "/preview_picture").c_str());
	_localRecordAbsoluteFileName = A2T(std::string(_exefold + "/preview_localRecord.mp4").c_str());
	SetDlgItemText(IDC_EDIT_PREVIEW_SNAL_FILE, _snapPicAbsoluteFileName);
	SetDlgItemText(IDC_EDIT_PREVIEW_LOCAL_FILE, _localRecordAbsoluteFileName);

	_osdIdComboBox.InsertString(0, L"0");  // iId ��1��ʼ
	_osdIdComboBox.SetItemData(0, static_cast<DWORD_PTR>(0));
	_osdIdComboBox.SetCurSel(0);
}

void CPreviewDialog::_printMsg(const std::string& func, int ret, int errorCode, ULONGLONG costs)
{
	char buffer[512] = { 0 };
	sprintf_s(buffer, "%sִ��%s����ʱ%I64d���룬������Ϊ%d", func.c_str(), ret != VIDEO_ERR_SUCCESS ? "ʧ��" : "�ɹ�", costs, errorCode);

	if (_msgList.GetCount() > 100)
	{
		_msgList.ResetContent();
	}

	USES_CONVERSION;
	_msgList.InsertString(0, A2T(buffer));

    _showListHovScollBar();
}

void CPreviewDialog::_printMsg(const std::string & msg)
{
	if (_msgList.GetCount() > 100)
	{
		_msgList.ResetContent();
	}

	USES_CONVERSION;
	_msgList.InsertString(0, A2T(msg.c_str()));

    _showListHovScollBar();
}

void CPreviewDialog::_showListHovScollBar()
{
    CDC *pDC = _msgList.GetDC();
    if (NULL == pDC)
    {
        return;
    }

    int nCount = _msgList.GetCount();
    if (nCount < 1)
    {
        _msgList.SetHorizontalExtent(0);
        return;
    }

    int nMaxExtent = 0;
    CString szText;
    for (int i = 0; i < nCount; ++i)
    {
        _msgList.GetText(i, szText);
        CSize &cs = pDC->GetTextExtent(szText);
        if (cs.cx > nMaxExtent)
        {
            nMaxExtent = cs.cx;
        }
    }

    _msgList.SetHorizontalExtent(nMaxExtent);
}

void CPreviewDialog::OnLbnDblclkListPlaybackMsgbox()
{
	int index = _msgList.GetCurSel();
	if (index < 0)
	{
		return;
	}

	CString str;
	_msgList.GetText(index, str);
	AfxMessageBox(str, MB_OK | MB_ICONINFORMATION);
}

