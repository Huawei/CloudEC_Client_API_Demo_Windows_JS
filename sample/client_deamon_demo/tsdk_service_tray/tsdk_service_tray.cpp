#include <windows.h>
#include "resource.h"
#include "tsdk_service_interface.h"
#pragma   comment(lib,   "lib/tupService.lib") 

#define IDR_PAUSE 12  
#define IDR_START 13
#define IDR_CLOSE 14
/* 
#include <shellapi.h> 
#pragma   comment(lib,   "shell32.lib")  
*/  
LPCTSTR szAppName = TEXT("TSDK Service Daemon");  
LPCTSTR szWndName = TEXT("TSDK Service Daemon");  
HMENU hmenu;//[cn]�˵���� [en]Menu handle  
  
LRESULT CALLBACK WndProc(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam)  
{  
    static NOTIFYICONDATA nid;  
    UINT WM_TASKBARCREATED;  
    POINT pt;//[cn]���ڽ����������  [en]Used to receive mouse coordinates
    int xx;//[cn]���ڽ��ղ˵�ѡ���ֵ  [en]This parameter is used to receive the return value of the menu option
  
    // [cn]��Ҫ�޸�TaskbarCreated������ϵͳ�������Զ������Ϣ [en]Do not modify TaskbarCreated. This is a customized message in the system task bar.  
    WM_TASKBARCREATED = RegisterWindowMessage(TEXT("TaskbarCreated"));  
    switch (message)  
    {  
    case WM_CREATE://[cn]���ڴ���ʱ�����Ϣ.   [en]Message displayed when a window is created
        nid.cbSize = sizeof(nid);  
        nid.hWnd = hwnd;  
        nid.uID = 0;  
        nid.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;  
        nid.uCallbackMessage = WM_USER;  
        nid.hIcon = LoadIcon(GetModuleHandle(NULL), MAKEINTRESOURCE(IDI_ICON1));  
        //lstrcpy(nid.szTip, szAppName);
		strcpy_s(nid.szTip, sizeof(nid.szTip), szAppName);
        Shell_NotifyIcon(NIM_ADD, &nid);  
        hmenu=CreatePopupMenu();//[cn]���ɲ˵�  [en]Generate Menu
		AppendMenu(hmenu,MF_STRING,IDR_CLOSE,"Stop Service"); 
        break;  
    case WM_USER://[cn]����ʹ�øó���ʱ�����Ϣ.  [en]Message for continuous use of the program
        if (lParam == WM_RBUTTONDOWN)  
        {  
            GetCursorPos(&pt);//[cn]ȡ�������  [en]Obtain the coordinates of the mouse
            ::SetForegroundWindow(hwnd);//[cn]����ڲ˵��ⵥ������˵�����ʧ������  [en]Solving the problem that the left mouse button does not disappear after you click the menu
            EnableMenuItem(hmenu,IDR_PAUSE,MF_GRAYED);//[cn]�ò˵��е�ĳһ����  [en]Turn a certain item in the menu to grey
            xx=TrackPopupMenu(hmenu,TPM_RETURNCMD,pt.x,pt.y,NULL,hwnd,NULL);//[cn]��ʾ�˵�����ȡѡ��ID  [en]The menu is displayed and the option ID is obtained
            if(xx==IDR_PAUSE) MessageBox(hwnd, TEXT("111"), szAppName, MB_OK);  
            if(xx==IDR_START) MessageBox(hwnd, TEXT("222"), szAppName, MB_OK);
			if(xx==IDR_CLOSE) SendMessage(hwnd, WM_CLOSE, wParam, lParam);
            if(xx==0) PostMessage(hwnd,WM_LBUTTONDOWN,NULL,NULL);    
        }  
        break;  
    case WM_DESTROY://[cn]��������ʱ�����Ϣ.  [en]Message when the window is destroyed
        Shell_NotifyIcon(NIM_DELETE, &nid);  
        PostQuitMessage(0);
		xx = WinExec("taskkill /F /IM tup_service_s.exe", SW_HIDE);		
        break;  
    default:  
        /* 
        * [cn]��ֹ��Explorer.exe �����Ժ󣬳�����ϵͳϵͳ�����е�ͼ�����ʧ 
        * [en]When the Explorer.exe breaks down, the icon disappears from the system tray
		*
        * [cn]ԭ��Explorer.exe �����������ؽ�ϵͳ����������ϵͳ������������ʱ�����ϵͳ������ 
        * ע�����TaskbarCreated ��Ϣ�Ķ������ڷ���һ����Ϣ������ֻ��Ҫ��׽�����Ϣ�����ؽ�ϵ 
        * ͳ���̵�ͼ�꼴�ɡ� 
		* [en]Principle: After the Explorer.exe is reloaded, the system task bar is rebuilt. When 
		* the system task bar is created, the system sends a message to all the top windows that 
		* register and receive TaskbarCreated messages. In this case, you only need to capture 
		* the message and re-create the icon of the system tray.
        */  
        if (message == WM_TASKBARCREATED)  
            SendMessage(hwnd, WM_CREATE, wParam, lParam);  
        break;  
    }  
    return DefWindowProc(hwnd, message, wParam, lParam);  
}  
  
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance,  
                   LPSTR szCmdLine, int iCmdShow)  
{  
    HWND hwnd;  
    MSG msg;  
    WNDCLASS wndclass;  
  
    HWND handle = FindWindow(NULL, szWndName);  
    if (handle != NULL)  
    {  
        MessageBox(NULL, TEXT("Application is already running"), szAppName, MB_ICONERROR);  
        return 0;  
    }  
  
	msg.wParam = 0;
    wndclass.style = CS_HREDRAW | CS_VREDRAW;  
    wndclass.lpfnWndProc = WndProc;  
    wndclass.cbClsExtra = 0;  
    wndclass.cbWndExtra = 0;  
    wndclass.hInstance = hInstance;  
    wndclass.hIcon = LoadIcon(NULL, IDI_APPLICATION);  
    wndclass.hCursor = LoadCursor(NULL, IDC_ARROW);  
    wndclass.hbrBackground = (HBRUSH)GetStockObject(WHITE_BRUSH);  
    wndclass.lpszMenuName = NULL;  
    wndclass.lpszClassName = szAppName;  
  
    if (!RegisterClass(&wndclass))  
    {  
        MessageBox(NULL, TEXT("This program requires Windows NT!"), szAppName, MB_ICONERROR);  
        return 0;  
    }  
  
    // [cn]�˴�ʹ��WS_EX_TOOLWINDOW ������������ʾ���������ϵĴ��ڳ���ť  
	// [en]The WS_EX_TOOLWINDOW property is used to hide the window program buttons displayed on the taskbar
    hwnd = CreateWindowEx(WS_EX_TOOLWINDOW,  
        szAppName, szWndName,  
        WS_POPUP,  
        CW_USEDEFAULT,  
        CW_USEDEFAULT,  
        CW_USEDEFAULT,  
        CW_USEDEFAULT,  
        NULL, NULL, hInstance, NULL);  
  
    ShowWindow(hwnd, iCmdShow);  
    UpdateWindow(hwnd);

	tup_service_deamon_startup(szCmdLine);
  
    while (GetMessage(&msg, NULL, 0, 0))  
    {  
        TranslateMessage(&msg);  
        DispatchMessage(&msg);  
    }  
    return msg.wParam;  
}  