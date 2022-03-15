// FilePlay.cpp : ʵ���ļ�
//

#include "stdafx.h"
#include "Demo.h"
#include "FilePlayDialog.h"
#include "afxdialogex.h"

#define MSG_UPDATE (WM_USER + 1500)
// CFilePlay �Ի���

IMPLEMENT_DYNAMIC(CFilePlayDialog, CDialog)

CFilePlayDialog::CFilePlayDialog(CWnd* pParent /*=NULL*/)
	: CDialog(IDD_DIALOG_FILEPLAY, pParent)
    , _filePlayName(_T(""))
    , _filePlayVoice(0)
    , _snapFileName(_T(""))
	, _volumeToSet(0)
	, _speed(0)
	, _secondsToSeek(0)
	, _privateMainType(0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020)
	, _privateSubType(0)
{
    
}

CFilePlayDialog::~CFilePlayDialog()
{
}

void CFilePlayDialog::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Text(pDX, IDC_EDIT_PLAYFILENAME, _filePlayName);
	DDX_Control(pDX, IDC_STATIC_FILEPLAYWND, _playWnd);
	DDX_Control(pDX, IDC_LIST_FILEPLAY_MSG, _msgList);
	DDX_Text(pDX, IDC_EDIT_FILEPLAYVOLUME, _filePlayVoice);
	DDX_Text(pDX, IDC_EDIT_FILESNAPNAME, _snapFileName);
	DDX_Text(pDX, IDC_EDIT_FILEPLAYVOLUME_TOSET, _volumeToSet);
	DDX_Control(pDX, IDC_CHECK_FILEPLAY_ISBMP, _useBmpCtrl);
	DDX_Text(pDX, IDC_EDIT_FILEPLAY_SPEED, _speed);
	DDX_Text(pDX, IDC_EDIT_FILEPLAY_SEEKTIME, _secondsToSeek);
	DDX_Text(pDX, IDC_EDIT_FILEPLAY_MAINTYPE, _privateMainType);
	DDX_Text(pDX, IDC_EDIT_FILEPLAY_SUBTYPE, _privateSubType);
}

BEGIN_MESSAGE_MAP(CFilePlayDialog, CDialog)
    ON_BN_CLICKED(IDC_BUTTON_STARTFILEPLAY, &CFilePlayDialog::OnBnClickedButtonStartfileplay)
    ON_BN_CLICKED(IDC_BUTTON_STOPFILEPLAY, &CFilePlayDialog::OnBnClickedButtonStopfileplay)
    ON_BN_CLICKED(IDC_BUTTON_GETFILEDURATION, &CFilePlayDialog::OnBnClickedButtonGetfileduration)
    ON_BN_CLICKED(IDC_BUTTON_GETFILEPLAYEDTIME, &CFilePlayDialog::OnBnClickedButtonGetfileplayedtime)
    ON_BN_CLICKED(IDC_BUTTON_OPENFILEVOICE, &CFilePlayDialog::OnBnClickedButtonOpenfilevoice)
    ON_BN_CLICKED(IDC_BUTTON_CLOSEFILEVOICE, &CFilePlayDialog::OnBnClickedButtonClosefilevoice)
    ON_BN_CLICKED(IDC_BUTTON_SETVOLUME, &CFilePlayDialog::OnBnClickedButtonSetvolume)
    ON_BN_CLICKED(IDC_BUTTON_GETVOLUME, &CFilePlayDialog::OnBnClickedButtonGetvolume)
    ON_BN_CLICKED(IDC_BUTTON_FILEPLAYSNAP, &CFilePlayDialog::OnBnClickedButtonFileplaysnap)
	ON_LBN_DBLCLK(IDC_LIST_FILEPLAY_MSG, &CFilePlayDialog::OnLbnDblclkListPlaybackMsgbox)
    ON_MESSAGE(MSG_UPDATE, &CFilePlayDialog::_onUpdateMsg)
	ON_BN_CLICKED(IDC_BUTTON_FILEPLAY_PAUSE, &CFilePlayDialog::OnBnClickedButtonFileplayPause)
	ON_BN_CLICKED(IDC_BUTTON_FILEPLAY_RESUME, &CFilePlayDialog::OnBnClickedButtonFileplayResume)
	ON_BN_CLICKED(IDC_BUTTON_FILEPLAY_SPEEDPLAY, &CFilePlayDialog::OnBnClickedButtonFileplaySpeedplay)
	ON_BN_CLICKED(IDC_BUTTON_FILEPLAY_SEEKPLAY, &CFilePlayDialog::OnBnClickedButtonFileplaySeekplay)
	ON_BN_CLICKED(IDC_BUTTON_FILEPLAY_PRIVATE_OPEN, &CFilePlayDialog::OnBnClickedButtonFileplayPrivateOpen)
	ON_BN_CLICKED(IDC_BUTTON_FILEPLAY_PRIVATE_CLOSE, &CFilePlayDialog::OnBnClickedButtonFileplayPrivateClose)
END_MESSAGE_MAP()

void CFilePlayDialog::NotifyDialogInited(const char* exeFolder)
{
	_exefold = nullptr == exeFolder ? "" : exeFolder;
    EnableToolTips(TRUE);
    _toolTip.Create(this);
	_toolTip.SetMaxTipWidth(500);
    _toolTip.Activate(TRUE);
	_toolTip.SetDelayTime(TTDT_AUTOPOP, 32000);
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_STARTFILEPLAY), L"��ʼ���ţ�Video_StartFilePlay��");
    _toolTip.AddTool(GetDlgItem(IDC_EDIT_PLAYFILENAME), L"��Ƶ�ļ�����·���ļ����ƣ�������׺���硰D:\\test.mp4��");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_STOPFILEPLAY), L"ֹͣ���ţ�Video_StopFilePlay��");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_GETFILEDURATION), L"��ȡ�ļ���ʱ����Video_GetFilePlayDuration����λ�룩");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_GETFILEPLAYEDTIME), L"��ȡ�ļ��Ѳ���ʱ����Video_GetFilePlayedTime����λ�룩");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_FILEPLAY_SEEKPLAY), L"��λ���ţ�Video_PlayCtrl��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAY_FILEDURATION), L"�ļ���ʱ������λ��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAY_SEEKTIME), L"�ļ���λ����ʱ�䣬��λ�룻��0��ʼ������ļ���ʱ���ڵ�����");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAY_PLAYEDTIME), L"�ļ��Ѳ���ʱ������λ��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_FILEPLAY_PAUSE), L"��ͣ���ţ�Video_PlayCtrl��");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_FILEPLAY_RESUME), L"�ָ����ţ�Video_PlayCtrl��");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_FILEPLAY_SPEEDPLAY), L"���ٲ��ţ�Video_PlayCtrl�������յ����ſ�ʼ��Ϣ����ʹ�ã�֧�ֵı���ֵ�У�-16-16�������� -8-8�������� -4-4�������� -2-2�������� 1-�����ٶȲ��� 2-2���ٿ�� 4-4���ٿ�� 8-8���ٿ�� 16-16���ٿ�ţ�");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAY_SPEED), L"���ٲ���ȡֵ��֧�ֵı���ֵ�У�-16-16�������� -8-8�������� -4-4�������� -2-2�������� 1-�����ٶȲ��� 2-2���ٿ�� 4-4���ٿ�� 8-8���ٿ�� 16-16���ٿ��");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_OPENFILEVOICE), L"��������Video_SoundCtrl��ֻ���ڴ����ϳ��ֳ�����ʱ���ܴ�������Ҳ���յ����ſ�ʼ��Ϣ�����ʹ�ã�");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_CLOSEFILEVOICE), L"�ر�������Video_SoundCtrl��");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_SETVOLUME), L"����������Video_SetVolume����������ʹ�ã�������Χ[0 100]��������Χʹ�ñ߽�ֵ��");
    _toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAYVOLUME), L"����ֵ����ȡ�������ڴ���ʾ"); 
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAYVOLUME_TOSET), L"����ֵ����ΧΪ[0 100]��������Χʹ�ñ߽�ֵ");
	_toolTip.AddTool(GetDlgItem(IDC_CHECK_FILEPLAY_ISBMP), L"ʹ��ץBMPλͼ����ѡ��ץλͼ������ץJPGͼƬ");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILESNAPNAME), L"����·���ļ����ƣ���������׺");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_GETVOLUME), L"��ȡ������Video_GetVolume��ֻ�д����������ʹ�ã�������Χ[0 100]��");
    _toolTip.AddTool(GetDlgItem(IDC_BUTTON_FILEPLAYSNAP), L"����ץͼ��Video_PlaySnap��Ĭ��ץjpgͼ��������á��Ƿ�����BMPץͼ����ץBMPλͼ��"); 
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_FILEPLAY_PRIVATE_OPEN), L"��ʾ˽�����ݣ�Video_PrivateDataCtrl����Ժ����豸����Щ�豸�����Ժ���SDK��EHOME/ISUP��ONVIF��GB28181Э����룻����û�������͵�˽�����ݣ���������֮�����ʹ�á�|����ʵ�ֵ�һ�νӿڿ��ƶ�����ͣ��������������͵ģ������������һ��һ�������ƣ����򽫺��������ͣ������������͵ĸ��������Ϳ���ʹ�á�|��ʵ�ֵ�һ�νӿڿ���ͬһ�����͵Ķ�������ͣ�");
	_toolTip.AddTool(GetDlgItem(IDC_BUTTON_FILEPLAY_PRIVATE_CLOSE), L"����˽�����ݣ�Video_PrivateDataCtrl����Ժ����豸����Щ�豸�����Ժ���SDK��EHOME/ISUP��ONVIF��GB28181Э����룻����û�������͵�˽�����ݣ���������֮�����ʹ�á�|����ʵ�ֵ�һ�νӿڿ��ƶ�����ͣ��������������͵ģ������������һ��һ�������ƣ����������͵ĸ��������Ϳ���ʹ�á�|��ʵ�ֵ�һ�νӿڿ���ͬһ�����͵Ķ�������ͣ�");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAY_MAINTYPE), L"˽�����������ͣ�0x0001-���ܷ��� 0x0002-�ƶ���� 0x0004-POS��Ϣ����� 0x0008-ͼƬ���� 0x0010-�ȳ�����Ϣ 0x0020-�¶���Ϣ��ʮ���������Ϳ�ѡ��ΧΪ1~63��������0x0010���ȳ�����Ϣ���������Ͷ���Ϊ0x0001-������ʾ 0x0002-����¶� 0x0004-����¶�λ�� 0x0008-����¶Ⱦ��루ʮ���������Ϳ�ѡ��ΧΪ1~15��������0x0020���¶���Ϣ���������Ͷ���Ϊ0x0001-����� 0x0002-�߲��� 0x0004-����£�ʮ���������Ϳ�ѡ��ΧΪ1~7��");
	_toolTip.AddTool(GetDlgItem(IDC_EDIT_FILEPLAY_SUBTYPE), L"˽�����������ͣ�����0x0010���ȳ�����Ϣ���������Ͷ���Ϊ0x0001-������ʾ 0x0002-����¶� 0x0004-����¶�λ�� 0x0008-����¶Ⱦ��루ʮ���������Ϳ�ѡ��ΧΪ1~15��������0x0020���¶���Ϣ���������Ͷ���Ϊ0x0001-����� 0x0002-�߲��� 0x0004-����£�ʮ���������Ϳ�ѡ��ΧΪ1~7��");

	USES_CONVERSION;
	_snapFileName = A2T(std::string(_exefold + "/filePlay_picture").c_str());
	SetDlgItemText(IDC_EDIT_FILESNAPNAME, _snapFileName);
	SetDlgItemText(IDC_EDIT_FILEPLAY_FILEDURATION, L"0");
	SetDlgItemText(IDC_EDIT_FILEPLAY_PLAYEDTIME, L"0");
}

BOOL CFilePlayDialog::PreTranslateMessage(MSG* pMsg)
{
	if (WM_MOUSEMOVE == pMsg->message || WM_LBUTTONDOWN == pMsg->message || WM_LBUTTONUP == pMsg->message)
	{
		_toolTip.RelayEvent(pMsg);
	}

	return CDialog::PreTranslateMessage(pMsg);
}

// ��ʼ����
void CFilePlayDialog::OnBnClickedButtonStartfileplay()
{
    if (_filePlayHandle != -1)
    {
        _printMsg("��ǰ���ڲ��ţ�����ֹͣ����");
        return;
    }

	CString str;
	GetDlgItemText(IDC_EDIT_PLAYFILENAME, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"����·���ļ����Ʋ���Ϊ��");
		return;
	}

    HWND hWnd = _playWnd.GetSafeHwnd();
    stFilePlayReq filePlayReq;
    filePlayReq = { 0 };
    filePlayReq.fnMsg = &CFilePlayDialog::cb_msgCallback;
    filePlayReq.pUserData = this;

    USES_CONVERSION;
	std::string fileName = T2A(str);
    ULONGLONG costTime = GetTickCount64();
    _filePlayHandle = Video_StartFilePlay(fileName.c_str(), hWnd, &filePlayReq);
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_StartFilePlay����ʼ�ļ����ţ�", _filePlayHandle != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costTime);
}

// ֹͣ����
void CFilePlayDialog::OnBnClickedButtonStopfileplay()
{
    ULONGLONG costTime = GetTickCount64();
    int ret = Video_StopFilePlay(_filePlayHandle);
    _filePlayHandle = -1;
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_StopFilePlay��ֹͣ�ļ����ţ�", ret, Video_GetLastError(), costTime);
    //���´��ڣ�ɾ�����һ֡
    PostMessage(MSG_UPDATE);

	// ˢ���´���
	_playWnd.ShowWindow(SW_HIDE);
	_playWnd.ShowWindow(SW_SHOW);
}

// ��ȡ�ļ���ʱ��
void CFilePlayDialog::OnBnClickedButtonGetfileduration()
{
    ULONGLONG costTime = GetTickCount64();
    VIDEO_INT64 retDuration = Video_GetFilePlayDuration(_filePlayHandle);
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_GetFilePlayDuration����ȡ�ļ���ʱ����", retDuration != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costTime);
	if (retDuration != VIDEO_ERR_FAIL)
	{
		CString str;
		str.Format(L"%d", retDuration);
		SetDlgItemText(IDC_EDIT_FILEPLAY_FILEDURATION, str);
	}
}

// ��ȡ��ǰ�Ѳ�������
void CFilePlayDialog::OnBnClickedButtonGetfileplayedtime()
{
    ULONGLONG costTime = GetTickCount64();
    VIDEO_INT64 retPlayedTime = Video_GetFilePlayedTime(_filePlayHandle);
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_GetFilePlayedTime����ȡ�Ѳ���ʱ����", retPlayedTime != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costTime);
	if (retPlayedTime != VIDEO_ERR_FAIL)
	{
		CString str;
		str.Format(L"%d", retPlayedTime);
		SetDlgItemText(IDC_EDIT_FILEPLAY_PLAYEDTIME, str);
	}
}

// ������
void CFilePlayDialog::OnBnClickedButtonOpenfilevoice()
{
    ULONGLONG costTime = GetTickCount64();
    int ret = Video_SoundCtrl(_filePlayHandle, 0);
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_SoundCtrl����������", ret, Video_GetLastError(), costTime);
}

// �ر�����
void CFilePlayDialog::OnBnClickedButtonClosefilevoice()
{
    ULONGLONG costTime = GetTickCount64();
    int ret = Video_SoundCtrl(_filePlayHandle, 1);
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_SoundCtrl���ر�������", ret, Video_GetLastError(), costTime);
}

// ��������
void CFilePlayDialog::OnBnClickedButtonSetvolume()
{
	CString str;
	GetDlgItemText(IDC_EDIT_FILEPLAYVOLUME_TOSET, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"����������ֵ����Ϊ��");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costTime = GetTickCount64();
	int ret = Video_SetVolume(_filePlayHandle, atoi(T2A(str)));
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_SetVolume������������", ret, Video_GetLastError(), costTime);
}

// ��ȡ����
void CFilePlayDialog::OnBnClickedButtonGetvolume()
{
    ULONGLONG costTime = GetTickCount64();
    int ret = Video_GetVolume(_filePlayHandle);
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_GetVolume����ȡ������", ret != VIDEO_ERR_FAIL ? VIDEO_ERR_SUCCESS : VIDEO_ERR_FAIL, Video_GetLastError(), costTime);
	if (ret != VIDEO_ERR_FAIL)
	{
		CString str;
		str.Format(L"%d", ret);
		SetDlgItemText(IDC_EDIT_FILEPLAYVOLUME, str);
	}
}

// ����ץͼ
void CFilePlayDialog::OnBnClickedButtonFileplaysnap()
{
	CString str;
	GetDlgItemText(IDC_EDIT_FILESNAPNAME, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"ץͼ���Ʋ���Ϊ��");
		return;
	}

	bool isBmp = BST_CHECKED == ((CButton*)GetDlgItem(IDC_CHECK_FILEPLAY_ISBMP))->GetCheck();
	str = str + CString(isBmp ? ".bmp" : ".jpg");

    USES_CONVERSION;
    ULONGLONG costTime = GetTickCount64();
    int ret = Video_PlaySnap(_filePlayHandle, T2A(str));
    costTime = GetTickCount64() - costTime;
    _printMsg("Video_PlaySnap���ļ�����ץͼ��", ret, Video_GetLastError(), costTime);
}

void CFilePlayDialog::_printMsg(const std::string& msg)
{
    if (_msgList.GetCount() > 100)
    {
        //��������ɾ�����һ�У�������ȫ��ɾ��
        _msgList.ResetContent();
    }

    USES_CONVERSION;
    _msgList.InsertString(0, A2T(msg.c_str()));

    _showListHovScollBar();
}

void CFilePlayDialog::_printMsg(const std::string& func, int ret, int errcodeCode, ULONGLONG costs)
{
    char buffer[512] = { 0 };
    sprintf_s(buffer, "%sִ��%s, ��ʱ%I64d���룬������Ϊ%d", func.c_str(), ret != VIDEO_ERR_SUCCESS ? "ʧ��" : "�ɹ�", costs, errcodeCode);
    if (_msgList.GetCount() > 100)
    {
        _msgList.ResetContent();
    }

    USES_CONVERSION;
    _msgList.InsertString(0, A2T(buffer));

    _showListHovScollBar();
}

void CFilePlayDialog::_showListHovScollBar()
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

void __stdcall CFilePlayDialog::cb_msgCallback(VIDEO_INT64 i64PlayHandle, int iMsg, void* pUserData)
{
    CFilePlayDialog* pThis = static_cast<CFilePlayDialog*>(pUserData);
    if (pThis != NULL)
    {
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
			default:
				str = "δ֪";
				break;
			}

			return str;
		};

        pThis->_printMsg(msgTransFunc(iMsg));
    }
}

LRESULT CFilePlayDialog::_onUpdateMsg(WPARAM wparam, LPARAM lparam)
{
    return 0;
}

void CFilePlayDialog::OnLbnDblclkListPlaybackMsgbox()
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

// ��ͣ����
void CFilePlayDialog::OnBnClickedButtonFileplayPause()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costTime = GetTickCount64();
	int ret = Video_PlayCtrl(_filePlayHandle, 0, 0);
	costTime = GetTickCount64() - costTime;
	_printMsg("Video_PlayCtrl����ͣ���ţ�", ret, Video_GetLastError(), costTime);
}

// �ָ�����
void CFilePlayDialog::OnBnClickedButtonFileplayResume()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	ULONGLONG costTime = GetTickCount64();
	int ret = Video_PlayCtrl(_filePlayHandle, 1, 0);
	costTime = GetTickCount64() - costTime;
	_printMsg("Video_PlayCtrl���ָ����ţ�", ret, Video_GetLastError(), costTime);
}

// ���ٲ���
void CFilePlayDialog::OnBnClickedButtonFileplaySpeedplay()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString str;
	GetDlgItemText(IDC_EDIT_FILEPLAY_SPEED, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"���ٲ����ٶ�ֵ����Ϊ��");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costTime = GetTickCount64();
	int ret = Video_PlayCtrl(_filePlayHandle, 3, atoi(T2A(str)));
	costTime = GetTickCount64() - costTime;
	_printMsg("Video_PlayCtrl�����ٲ��ţ�", ret, Video_GetLastError(), costTime);
}

// ��λ����
void CFilePlayDialog::OnBnClickedButtonFileplaySeekplay()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString str;
	GetDlgItemText(IDC_EDIT_FILEPLAY_SEEKTIME, str);
	if (str.IsEmpty())
	{
		AfxMessageBox(L"��λʱ�䲻��Ϊ��");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costTime = GetTickCount64();
	int ret = Video_PlayCtrl(_filePlayHandle, 2, atoll(T2A(str)));
	costTime = GetTickCount64() - costTime;
	_printMsg("Video_PlayCtrl����λ���ţ�", ret, Video_GetLastError(), costTime);
}


void CFilePlayDialog::OnBnClickedButtonFileplayPrivateOpen()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString strMainType;
	GetDlgItemText(IDC_EDIT_FILEPLAY_MAINTYPE, strMainType);
	if (strMainType.IsEmpty())
	{
		AfxMessageBox(L"˽�����������Ͳ���Ϊ��");
		return;
	}

	CString strSubType;
	GetDlgItemText(IDC_EDIT_FILEPLAY_SUBTYPE, strSubType);
	if (strSubType.IsEmpty())
	{
		AfxMessageBox(L"˽�����������Ͳ���Ϊ��");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	std::string szAMainType = T2A(strMainType);
	std::string szASubType = T2A(strSubType);
	int ret = Video_PrivateDataCtrl(_filePlayHandle, atoi(szAMainType.c_str()), 0, atoi(szASubType.c_str()));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PrivateDataCtrl��˽��������ʾ��", ret, Video_GetLastError(), costs);
}


void CFilePlayDialog::OnBnClickedButtonFileplayPrivateClose()
{
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	CString strMainType;
	GetDlgItemText(IDC_EDIT_FILEPLAY_MAINTYPE, strMainType);
	if (strMainType.IsEmpty())
	{
		AfxMessageBox(L"˽�����������Ͳ���Ϊ��");
		return;
	}

	CString strSubType;
	GetDlgItemText(IDC_EDIT_FILEPLAY_SUBTYPE, strSubType);
	if (strSubType.IsEmpty())
	{
		AfxMessageBox(L"˽�����������Ͳ���Ϊ��");
		return;
	}

	USES_CONVERSION;
	ULONGLONG costs = GetTickCount64();
	std::string szAMainType = T2A(strMainType);
	std::string szASubType = T2A(strSubType);
	int ret = Video_PrivateDataCtrl(_filePlayHandle, atoi(szAMainType.c_str()), 1, atoi(szASubType.c_str()));
	costs = GetTickCount64() - costs;
	_printMsg("Video_PrivateDataCtrl��˽���������أ�", ret, Video_GetLastError(), costs);
}
